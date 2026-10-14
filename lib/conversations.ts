// Conversations repository. The ONLY place that knows where chats are
// stored (localStorage for now). Components use these functions and hooks,
// so Slice 2 can swap the storage for Supabase without touching the UI.

import { useMemo, useSyncExternalStore } from "react";
import { titleFromFirstMessage } from "./conversation-title";
import { newId } from "./id";
import { takeLegacyMessages } from "./local-store";
import type { Conversation, Message, MessageRole } from "./types";

type Store = {
  conversations: Conversation[];
  messages: Message[];
  /** The chat the user last had open ("current" for Home's Ask box). */
  lastOpenedId: string | null;
};

const STORAGE_KEY = "nurora:chats:v1";

let store: Store | null = null;
const listeners = new Set<() => void>();

function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Store;
  } catch {
    // Corrupt or blocked storage: start fresh.
  }
  return migrateSingleChat();
}

/** Moves the old single chat history into a first conversation (once). */
function migrateSingleChat(): Store {
  const fresh: Store = { conversations: [], messages: [], lastOpenedId: null };
  const legacy = takeLegacyMessages().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  if (legacy.length > 0) {
    const id = newId();
    const firstUser = legacy.find((m) => m.role === "user");
    fresh.conversations.push({
      id,
      title: titleFromFirstMessage(firstUser?.content ?? legacy[0].content),
      createdAt: legacy[0].createdAt,
      updatedAt: legacy[legacy.length - 1].createdAt,
    });
    fresh.messages = legacy.map((m) => ({ ...m, conversationId: id }));
    fresh.lastOpenedId = id;
  }
  save(fresh);
  return fresh;
}

function save(next: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: keep working in memory.
  }
}

function getStore(): Store {
  if (!store) store = load();
  return store;
}

function update(change: (current: Store) => Store) {
  store = change(getStore());
  save(store);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const byUpdatedDesc = (a: Conversation, b: Conversation) => b.updatedAt.localeCompare(a.updatedAt);

// ----- Reads -------------------------------------------------------------

/** All conversations, newest activity first. */
export function listConversations(): Conversation[] {
  return [...getStore().conversations].sort(byUpdatedDesc);
}

export function getConversation(id: string): Conversation | null {
  return getStore().conversations.find((c) => c.id === id) ?? null;
}

export function getMessages(conversationId: string): Message[] {
  return getStore().messages.filter((m) => m.conversationId === conversationId);
}

/** The most recently active conversation, if any. */
export function getMostRecentConversationId(): string | null {
  return listConversations()[0]?.id ?? null;
}

/** "Current" chat for sending from outside Chat: last opened, else most recent. */
export function getCurrentConversationId(): string | null {
  const { lastOpenedId } = getStore();
  if (lastOpenedId && getConversation(lastOpenedId)) return lastOpenedId;
  return getMostRecentConversationId();
}

// ----- Writes ------------------------------------------------------------

/** Creates a conversation titled from its first message. */
export function createConversation(firstMessage: string): Conversation {
  const now = new Date().toISOString();
  const conversation: Conversation = {
    id: newId(),
    title: titleFromFirstMessage(firstMessage),
    createdAt: now,
    updatedAt: now,
  };
  update((s) => ({ ...s, conversations: [...s.conversations, conversation] }));
  return conversation;
}

/** Adds a message and bumps the conversation to the top. No-op if it was deleted. */
export function appendMessage(
  conversationId: string,
  role: MessageRole,
  content: string,
): Message | null {
  if (!getConversation(conversationId)) return null;
  const message: Message = {
    id: newId(),
    conversationId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
  update((s) => ({
    ...s,
    messages: [...s.messages, message],
    conversations: s.conversations.map((c) =>
      c.id === conversationId ? { ...c, updatedAt: message.createdAt } : c,
    ),
  }));
  return message;
}

export function renameConversation(id: string, title: string) {
  const clean = title.replace(/\s+/g, " ").trim();
  if (!clean) return;
  update((s) => ({
    ...s,
    conversations: s.conversations.map((c) => (c.id === id ? { ...c, title: clean } : c)),
  }));
}

export function setConversationPinned(id: string, pinned: boolean) {
  update((s) => ({
    ...s,
    conversations: s.conversations.map((c) => (c.id === id ? { ...c, pinned } : c)),
  }));
}

/** Deletes a conversation and its messages. */
export function deleteConversation(id: string) {
  update((s) => ({
    conversations: s.conversations.filter((c) => c.id !== id),
    messages: s.messages.filter((m) => m.conversationId !== id),
    lastOpenedId: s.lastOpenedId === id ? null : s.lastOpenedId,
  }));
}

export function setLastOpenedConversation(id: string) {
  if (getStore().lastOpenedId === id) return;
  update((s) => ({ ...s, lastOpenedId: id }));
}

export function deleteMessage(id: string) {
  update((s) => ({ ...s, messages: s.messages.filter((m) => m.id !== id) }));
}

/** Puts a deleted message back in its original place (for "Undo"). */
export function restoreMessage(message: Message) {
  update((s) =>
    s.messages.some((m) => m.id === message.id)
      ? s
      : {
          ...s,
          messages: [...s.messages, message].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
        },
  );
}

// ----- Hooks (null until the browser has loaded the data) ---------------

function useStore(): Store | null {
  return useSyncExternalStore(subscribe, getStore, () => null);
}

/** Conversations, newest activity first. */
export function useConversations(): Conversation[] | null {
  const s = useStore();
  return useMemo(() => (s ? [...s.conversations].sort(byUpdatedDesc) : null), [s]);
}

export function useConversation(id: string | null | undefined): Conversation | null {
  const s = useStore();
  return useMemo(() => (s && id ? (s.conversations.find((c) => c.id === id) ?? null) : null), [s, id]);
}

/** Messages of one conversation, oldest first. Empty for a new (unsaved) chat. */
export function useMessages(conversationId: string | null | undefined): Message[] | null {
  const s = useStore();
  return useMemo(() => {
    if (!s) return null;
    if (!conversationId) return [];
    return s.messages.filter((m) => m.conversationId === conversationId);
  }, [s, conversationId]);
}

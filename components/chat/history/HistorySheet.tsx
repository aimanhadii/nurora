"use client";

import { useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { History, Search, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ConversationList } from "./ConversationList";

// Drag the handle down this far to close the sheet.
const DISMISS_DRAG_PX = 120;

/** Phone chat history: header button that opens an 85%-height bottom sheet. */
export function HistorySheet() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<number | null>(null);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function onDragStart(e: PointerEvent<HTMLDivElement>) {
    dragStart.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onDragMove(e: PointerEvent<HTMLDivElement>) {
    if (dragStart.current !== null) setDragY(Math.max(0, e.clientY - dragStart.current));
  }
  function onDragEnd() {
    if (dragStart.current === null) return;
    dragStart.current = null;
    setDragging(false);
    if (dragY > DISMISS_DRAG_PX) close();
    setDragY(0);
  }

  return (
    <Sheet open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Chat history">
          <History className="size-5" strokeWidth={1.5} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        // data-[side=bottom]: matches the specificity of the Sheet's own "h-auto".
        className="gap-0 pb-[env(safe-area-inset-bottom)] data-[side=bottom]:h-[85dvh]"
        // Don't focus the search box on open: on a phone that pops the keyboard
        // over the list. Focus stays on the sheet (Escape still closes it).
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          (e.target as HTMLElement).focus();
        }}
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? "none" : undefined,
        }}
      >
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          className="flex shrink-0 touch-none justify-center pt-3 pb-1"
          aria-hidden="true"
        >
          <span className="h-1.5 w-10 rounded-full bg-foreground/20" />
        </div>

        <SheetHeader className="pt-2">
          <SheetTitle>Chats</SheetTitle>
          <SheetDescription className="sr-only">Your previous conversations</SheetDescription>
        </SheetHeader>

        <div className="space-y-3 px-5 pt-4 pb-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.5}
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              aria-label="Search chats"
              className="pl-9"
            />
          </div>
          <Button asChild variant="outline" className="h-11 w-full justify-start gap-3 rounded-lg px-3">
            <Link href="/chat/new" onClick={close}>
              <SquarePen className="size-5" strokeWidth={1.5} />
              New chat
            </Link>
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6">
          <ConversationList query={query} variant="sheet" onNavigate={close} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { ListChecks, MessageCircle, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; Icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { href: "/chat", label: "Chat", Icon: MessageCircle },
  { href: "/tasks", label: "Tasks", Icon: ListChecks },
];

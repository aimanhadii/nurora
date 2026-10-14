"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatIcon, ListIcon } from "./icons";

const TABS = [
  { href: "/chat", label: "Chat", Icon: ChatIcon },
  { href: "/tasks", label: "Tasks", Icon: ListIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-rose-100 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="flex">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                  active ? "text-rose-500" : "text-stone-400"
                }`}
              >
                <Icon className="size-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

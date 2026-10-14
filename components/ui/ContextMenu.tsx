"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { GlassPanel } from "./GlassPanel";

export type MenuItem = {
  label: string;
  Icon: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
};

type Position = { x: number; y: number };

const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE_PX = 10;
const EDGE_PX = 8;

/**
 * Opens a menu by long-press (touch), right-click, or a "…" button.
 * Spread `targetProps` on the item and `buttonProps` on the "…" button.
 */
export function useContextMenu() {
  const [position, setPosition] = useState<Position | null>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const touchStart = useRef<Position | null>(null);
  const longPressed = useRef(false);

  function open(x: number, y: number, focusAfter: HTMLElement | null) {
    returnFocusTo.current = focusAfter;
    setPosition({ x, y });
  }

  function close() {
    setPosition(null);
    returnFocusTo.current?.focus();
  }

  function cancelPress() {
    clearTimeout(timer.current);
    touchStart.current = null;
  }

  // React events bubble through portals (menus, sheets) too; only react to
  // events that really happened inside the item on the page.
  const isInside = (e: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>) =>
    e.currentTarget.contains(e.target as Node);

  const targetProps = {
    onContextMenu(e: MouseEvent<HTMLElement>) {
      if (!isInside(e)) return;
      e.preventDefault();
      open(e.clientX, e.clientY, null);
    },
    onTouchStart(e: TouchEvent<HTMLElement>) {
      if (!isInside(e)) return;
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
      longPressed.current = false;
      timer.current = setTimeout(() => {
        if (!touchStart.current) return;
        longPressed.current = true;
        navigator.vibrate?.(8);
        open(touchStart.current.x, touchStart.current.y, null);
      }, LONG_PRESS_MS);
    },
    onTouchMove(e: TouchEvent<HTMLElement>) {
      const start = touchStart.current;
      const t = e.touches[0];
      if (
        start &&
        Math.hypot(t.clientX - start.x, t.clientY - start.y) > MOVE_TOLERANCE_PX
      )
        cancelPress();
    },
    onTouchEnd(e: TouchEvent<HTMLElement>) {
      cancelPress();
      // Stop the finger-lift from also counting as a tap (e.g. ticking a task).
      if (longPressed.current) e.preventDefault();
    },
    onTouchCancel: cancelPress,
  };

  const buttonProps = {
    "aria-haspopup": "menu" as const,
    "aria-expanded": position !== null,
    onClick(e: MouseEvent<HTMLElement>) {
      const rect = e.currentTarget.getBoundingClientRect();
      open(rect.left, rect.bottom + 6, e.currentTarget);
    },
  };

  return { position, close, targetProps, buttonProps };
}

export function ContextMenu({
  position,
  items,
  label,
  onClose,
}: {
  position: Position | null;
  items: MenuItem[];
  label: string;
  onClose: () => void;
}) {
  if (!position) return null;
  return createPortal(
    <MenuLayer position={position} items={items} label={label} onClose={onClose} />,
    document.body,
  );
}

function MenuLayer({
  position,
  items,
  label,
  onClose,
}: {
  position: Position;
  items: MenuItem[];
  label: string;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  // Latest onClose without re-running the effects below on every render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Before the first paint: keep the menu on screen, then focus item 1.
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const { width, height } = menu.getBoundingClientRect();
    const maxX = window.innerWidth - width - EDGE_PX;
    const maxY = window.innerHeight - height - EDGE_PX;
    menu.style.left = `${Math.max(EDGE_PX, Math.min(position.x, maxX))}px`;
    menu.style.top = `${Math.max(EDGE_PX, Math.min(position.y, maxY))}px`;
    menu.querySelector<HTMLElement>("[role=menuitem]")?.focus();
  }, [position]);

  useEffect(() => {
    const close = () => onCloseRef.current();
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  function handleKeyDown(e: KeyboardEvent) {
    const buttons = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [],
    );
    const index = buttons.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      buttons[(index + 1) % buttons.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <GlassPanel
        ref={menuRef}
        role="menu"
        aria-label={label}
        strength="strong"
        onKeyDown={handleKeyDown}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        style={{ left: position.x, top: position.y }}
        className="fixed w-56 origin-top-left animate-menu-in overflow-hidden rounded-[18px] p-0"
      >
        <ul className="divide-y divide-hairline">
          {items.map(({ label, Icon, onSelect, destructive }) => (
            <li key={label}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onClose();
                  onSelect();
                }}
                className={`flex h-11 w-full items-center justify-between px-4 text-[15px] outline-none transition-colors hover:bg-glass-hover focus-visible:bg-glass-hover ${
                  destructive ? "text-danger" : "text-fg"
                }`}
              >
                {label}
                <Icon className="size-[18px]" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}

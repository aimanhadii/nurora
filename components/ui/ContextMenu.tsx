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
import { Check, type LucideIcon } from "lucide-react";
import { Surface } from "./Surface";

export type MenuItem = {
  label: string;
  Icon: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
  /** Set for pick-one options (e.g. themes); shows a tick when true. */
  checked?: boolean;
};

/**
 * Where to open. `anchorTop` lets the menu flip above its button and
 * `anchorRight` lets it line up with the button's right edge.
 */
type Position = { x: number; y: number; anchorTop: number; anchorRight?: number };

const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE_PX = 10;
const EDGE_PX = 8;
const GAP_PX = 6;

/**
 * Opens a menu by long-press (touch), right-click, or a "…" button.
 * Spread `targetProps` on the item and `buttonProps` on the button.
 */
export function useContextMenu() {
  const [position, setPosition] = useState<Position | null>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const longPressed = useRef(false);

  function open(position: Position, focusAfter: HTMLElement | null) {
    returnFocusTo.current = focusAfter;
    setPosition(position);
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
      open({ x: e.clientX, y: e.clientY, anchorTop: e.clientY }, null);
    },
    onTouchStart(e: TouchEvent<HTMLElement>) {
      if (!isInside(e)) return;
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
      longPressed.current = false;
      timer.current = setTimeout(() => {
        const start = touchStart.current;
        if (!start) return;
        longPressed.current = true;
        navigator.vibrate?.(8);
        open({ ...start, anchorTop: start.y }, null);
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
      open(
        {
          x: rect.left,
          y: rect.bottom + GAP_PX,
          anchorTop: rect.top,
          anchorRight: rect.right,
        },
        e.currentTarget,
      );
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

  // Before the first paint: keep the menu on screen (flipping above its
  // button if there's no room below), then focus the first item.
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const { width, height } = menu.getBoundingClientRect();
    const fitsBelow = position.y + height <= window.innerHeight - EDGE_PX;
    const top = fitsBelow ? position.y : position.anchorTop - GAP_PX - height;
    const fitsRight = position.x + width <= window.innerWidth - EDGE_PX;
    const left =
      fitsRight || position.anchorRight === undefined
        ? position.x
        : position.anchorRight - width;
    const maxX = window.innerWidth - width - EDGE_PX;
    const maxY = window.innerHeight - height - EDGE_PX;
    menu.style.left = `${Math.max(EDGE_PX, Math.min(left, maxX))}px`;
    menu.style.top = `${Math.max(EDGE_PX, Math.min(top, maxY))}px`;
    menu.querySelector<HTMLElement>("[role^=menuitem]")?.focus();
  }, [position]);

  useEffect(() => {
    const close = () => onCloseRef.current();
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  function handleKeyDown(e: KeyboardEvent) {
    const buttons = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>("[role^=menuitem]") ?? [],
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
      <Surface
        ref={menuRef}
        role="menu"
        aria-label={label}
        variant="raised"
        onKeyDown={handleKeyDown}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        style={{ left: position.x, top: position.y }}
        className="fixed w-56 origin-top-left animate-menu-in overflow-hidden rounded-[18px]"
      >
        <ul className="divide-y divide-border">
          {items.map(({ label, Icon, onSelect, destructive, checked }) => (
            <li key={label}>
              <button
                type="button"
                role={checked === undefined ? "menuitem" : "menuitemradio"}
                aria-checked={checked}
                onClick={() => {
                  onClose();
                  onSelect();
                }}
                className={`flex h-11 w-full items-center gap-3 px-4 text-[15px] outline-none transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 ${
                  destructive ? "text-danger" : "text-text"
                }`}
              >
                <span className="flex-1 text-left">{label}</span>
                {checked && (
                  <Check className="size-4 text-accent" strokeWidth={2} />
                )}
                <Icon
                  className={`size-[18px] ${destructive ? "" : "text-text-2"}`}
                  strokeWidth={1.5}
                />
              </button>
            </li>
          ))}
        </ul>
      </Surface>
    </div>
  );
}

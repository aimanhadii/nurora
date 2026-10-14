import { formatTime } from "@/lib/time";
import type { Message } from "@/lib/types";

export function MessageBubble({
  message,
  animate,
}: {
  message: Message;
  animate?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} ${
        animate ? "animate-message-in" : ""
      }`}
    >
      <div
        className={`max-w-[85%] rounded-[20px] px-4 py-2.5 text-[15px] leading-relaxed md:max-w-[75%] ${
          isUser
            ? "rounded-br-md bg-fg text-bg"
            : "rounded-bl-md border border-line bg-surface"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      <time
        dateTime={message.createdAt}
        className="mt-1 px-1 text-[11px] text-muted"
      >
        {isUser ? "" : "Teman · "}
        {formatTime(message.createdAt)}
      </time>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex animate-message-in items-start">
      <div
        role="status"
        aria-label="Teman is typing"
        className="flex gap-1 rounded-[20px] rounded-bl-md border border-line bg-surface px-4 py-4"
      >
        {[0, 160, 320].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-typing rounded-full bg-muted"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { sendChatMessage } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Orb } from "@/components/ui/Orb";
import { QuickChips } from "@/components/chat/QuickChips";

/** A compact chat box; sending continues the conversation in Chat. */
export function AskNuroraCard({ className }: { className?: string }) {
  const router = useRouter();
  const [text, setText] = useState("");

  function send(message: string) {
    if (!message.trim()) return;
    sendChatMessage(message);
    router.push("/chat");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    send(text);
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <Orb size={16} />
          Ask Nurora
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={handleSubmit} className="relative">
          <label htmlFor="ask-nurora" className="sr-only">
            Ask Nurora
          </label>
          <Input
            id="ask-nurora"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="esok 3pm meeting, or ask anything…"
            autoComplete="off"
            enterKeyHint="send"
            className="pr-12"
          />
          <Button
            type="submit"
            size="icon-sm"
            variant={text.trim() ? "default" : "ghost"}
            disabled={!text.trim()}
            aria-label="Send to Nurora"
            className={cn("absolute top-1/2 right-2 -translate-y-1/2")}
          >
            <ArrowUp strokeWidth={1.5} />
          </Button>
        </form>
        <QuickChips onPick={send} />
      </CardContent>
    </Card>
  );
}

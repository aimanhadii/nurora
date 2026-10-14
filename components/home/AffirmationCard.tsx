"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bookmark, BookmarkCheck, RefreshCw } from "lucide-react";
import { AFFIRMATIONS, affirmationIndexFor } from "@/lib/affirmations";
import { toggleSavedAffirmation } from "@/lib/local-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Orb } from "@/components/ui/Orb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AffirmationCard({
  todayKey,
  saved,
  className,
}: {
  todayKey: string;
  saved: string[];
  className?: string;
}) {
  // Today's pick, plus however many times "refresh" was pressed.
  const [skip, setSkip] = useState(0);
  const text =
    AFFIRMATIONS[(affirmationIndexFor(todayKey) + skip) % AFFIRMATIONS.length];
  const isSaved = saved.includes(text);
  const SaveIcon = isSaved ? BookmarkCheck : Bookmark;

  return (
    <Card interactive className={className}>
      <CardHeader>
        <CardTitle>
          <Orb size={16} />
          Today&apos;s affirmation
        </CardTitle>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Show another affirmation"
                onClick={() => setSkip(skip + 1)}
              >
                <RefreshCw strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Another one</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={
                  isSaved ? "Remove from favourites" : "Save to favourites"
                }
                aria-pressed={isSaved}
                className={isSaved ? "text-brand" : undefined}
                onClick={() =>
                  toast(
                    toggleSavedAffirmation(text)
                      ? "Saved to favourites"
                      : "Removed from favourites",
                  )
                }
              >
                <SaveIcon strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isSaved ? "Saved" : "Save"}</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <blockquote
          key={text}
          className="animate-fade-in font-display text-xl leading-snug font-normal text-balance italic md:text-2xl"
        >
          “{text}”
        </blockquote>
      </CardContent>
    </Card>
  );
}

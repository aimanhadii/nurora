"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** "Delete chat?" confirmation with a red destructive action. */
export function DeleteConversationDialog({
  title,
  open,
  onOpenChange,
  onConfirm,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete chat?</DialogTitle>
          <DialogDescription>
            “{title}” and its messages will be deleted. Your tasks stay as they are.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" className="h-11 md:h-9" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="h-11 bg-destructive text-primary-foreground hover:bg-destructive/90 focus-visible:ring-destructive/30 md:h-9"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

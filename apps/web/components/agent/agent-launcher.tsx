"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Loader2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The chat panel is code-split: its chunk (useChat, markdown, the model picker)
 * downloads only when the launcher first opens, so it never weighs on initial
 * page load. `ssr: false` is valid here because the launcher is a client
 * component.
 */
const ChatPanel = dynamic(() => import("./chat-panel").then((m) => m.ChatPanel), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-background">
      <Loader2 aria-hidden className="size-5 animate-spin text-muted-foreground" />
    </div>
  ),
});

/**
 * Floating agent launcher, mounted once in the root layout. A fixed-position
 * button (no layout shift) opens a Base UI dialog: a full-screen sheet on
 * mobile, a bottom-right panel on desktop. Focus trap, Escape, and click-outside
 * are handled by Base UI. Hidden on /agent, which hosts the panel full-size.
 */
export function AgentLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/agent") return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal>
      <Dialog.Trigger
        aria-label="Open the portfolio agent"
        className={cn(
          "cta-gradient fixed right-5 bottom-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform",
          "hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        )}
      >
        <MessageCircle aria-hidden className="size-5" />
        <span className="hidden sm:inline">Ask the agent</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm transition-opacity duration-200",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          )}
        />
        <Dialog.Popup
          className={cn(
            "fixed z-[70] flex flex-col overflow-hidden bg-background outline-none",
            // Mobile: full-screen sheet.
            "inset-0",
            // Desktop: anchored bottom-right card.
            "sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(38rem,calc(100vh-6rem))] sm:w-[24rem] sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl",
            "transition-[opacity,transform] duration-200",
            "data-[starting-style]:translate-y-3 data-[starting-style]:opacity-0",
            "data-[ending-style]:translate-y-3 data-[ending-style]:opacity-0",
          )}
        >
          <Dialog.Title className="sr-only">Portfolio Agent</Dialog.Title>
          <Dialog.Description className="sr-only">
            Chat about Javier Ramos&apos;s projects, stack, and how he works.
          </Dialog.Description>
          <ChatPanel onClose={() => setOpen(false)} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

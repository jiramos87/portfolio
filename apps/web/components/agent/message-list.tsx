"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Bot, Loader2 } from "lucide-react";
import { modelLabel } from "@/lib/agent/model-catalog";
import type { AgentMetadata } from "@/lib/agent/prompt";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import { SourceChips } from "./source-chips";
import { type AgentUIMessage, messageText } from "./types";

type ChatStatus = "submitted" | "streaming" | "ready" | "error";

/** The public Langfuse trace URL (B08); null when tracing is off, which hides the link. */
function traceUrlOf(metadata: AgentMetadata | undefined): string | null {
  const url = metadata?.traceUrl;
  return url && url.length > 0 ? url : null;
}

/** The honest "answered by" caption: names the model, or explains the free fallback when degraded/capped. */
function servedByCaption(metadata: AgentMetadata): { text: string; warn: boolean } {
  if (metadata.capped) {
    return {
      text: "The monthly model budget is spent, so a free fallback model answered. Your selected model was not used.",
      warn: true,
    };
  }
  if (metadata.degraded) {
    return {
      text: "Answered by a free fallback model (the selected model was briefly unavailable).",
      warn: true,
    };
  }
  const label =
    metadata.servedBy.provider === "groq"
      ? "the free fallback model"
      : modelLabel(metadata.servedBy.model);
  return { text: `Answered by ${label}.`, warn: false };
}

function AssistantFooter({ metadata }: { metadata: AgentMetadata }) {
  const caption = servedByCaption(metadata);
  const traceUrl = traceUrlOf(metadata);
  return (
    <>
      <SourceChips citations={metadata.citations} />
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className={cn("text-[11px]", caption.warn ? "text-warning" : "text-muted-foreground")}>
          {caption.text}
        </p>
        {traceUrl ? (
          <a
            href={traceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
          >
            See how I answered
            <ArrowUpRight aria-hidden className="size-3" />
          </a>
        ) : null}
      </div>
    </>
  );
}

function Avatar() {
  return (
    <span
      aria-hidden
      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"
    >
      <Bot className="size-3.5" />
    </span>
  );
}

export function MessageList({
  messages,
  status,
}: {
  messages: AgentUIMessage[];
  status: ChatStatus;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the newest content in view as it streams.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, status]);

  const thinking =
    status === "submitted" ||
    (status === "streaming" && messages[messages.length - 1]?.role !== "assistant");

  return (
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      aria-label="Conversation"
      className="flex flex-col gap-4"
    >
      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                {messageText(message)}
              </div>
            </div>
          );
        }
        const metadata = message.metadata;
        const text = messageText(message);
        return (
          <div key={message.id} className="flex gap-2">
            <Avatar />
            <div className="min-w-0 flex-1">
              {text ? (
                <Markdown>{text}</Markdown>
              ) : (
                <p className="text-sm text-muted-foreground">…</p>
              )}
              {metadata ? <AssistantFooter metadata={metadata} /> : null}
            </div>
          </div>
        );
      })}

      {thinking ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar />
          <span className="inline-flex items-center gap-1.5">
            <Loader2 aria-hidden className="size-3.5 animate-spin" />
            Thinking…
          </span>
        </div>
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
}

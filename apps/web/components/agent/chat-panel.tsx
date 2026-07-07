"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Bot, Square, SquarePen, X } from "lucide-react";
import { DEFAULT_MODEL_ID, resolveModelId } from "@/lib/agent/model-catalog";
import { INPUT_MAX_CHARS } from "@/lib/agent/prompt";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { MessageList } from "./message-list";
import { ModelPicker } from "./model-picker";
import { SuggestionChips } from "./suggestion-chips";
import type { AgentUIMessage } from "./types";

/** Mirrors the server CAPS.MAX_TURNS (limits.ts is server-only). Advisory: the route enforces it too. */
const MAX_TURNS = 12;
const MODEL_STORAGE_KEY = "agent:model";
const CONTACT_HREF = "/contact";

/** Pull the honest error message out of the route's JSON error body, else fall back. */
function humanizeError(error: Error | undefined): string {
  if (!error) return "Something went wrong. Please try again.";
  try {
    const parsed = JSON.parse(error.message) as { error?: unknown };
    if (typeof parsed.error === "string" && parsed.error.length > 0) return parsed.error;
  } catch {
    // not JSON; fall through to the raw message
  }
  return error.message || "Something went wrong. Please try again.";
}

export function ChatPanel({ onClose }: { onClose?: () => void }) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/agent" }), []);
  const { messages, sendMessage, status, error, stop, setMessages } =
    useChat<AgentUIMessage>({ transport });

  const [modelId, setModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Restore the visitor's model choice; focus the composer on open.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(MODEL_STORAGE_KEY);
      if (saved) setModelId(resolveModelId(saved));
    } catch {
      // localStorage unavailable (private mode); keep the default
    }
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  function selectModel(id: string) {
    setModelId(id);
    try {
      window.localStorage.setItem(MODEL_STORAGE_KEY, id);
    } catch {
      // ignore persistence failures
    }
  }

  const userTurns = messages.filter((m) => m.role === "user").length;
  const atTurnCap = userTurns >= MAX_TURNS;
  const busy = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy || atTurnCap) return;
    sendMessage({ text: trimmed }, { body: { modelId } });
    setInput("");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function newChat() {
    stop();
    setMessages([]);
    setInput("");
    inputRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <span
            aria-hidden
            className="cta-gradient flex size-6 items-center justify-center rounded-md text-primary-foreground"
          >
            <Bot className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold text-foreground">Portfolio Agent</h2>
            <p className="truncate text-[11px] text-muted-foreground">
              Ask about Javier&apos;s work, stack, and process.
            </p>
          </div>
          {!isEmpty ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={newChat}
              aria-label="Start a new chat"
            >
              <SquarePen className="size-4" />
            </Button>
          ) : null}
          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close the agent"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
        <div className="px-4 pb-3">
          <ModelPicker value={modelId} onChange={selectModel} disabled={busy} />
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {isEmpty ? (
          <div className="flex h-full flex-col justify-center gap-4">
            <p className="text-sm text-muted-foreground">
              I answer from Javier&apos;s portfolio, live GitHub activity, and this agent&apos;s own
              eval. Try one of these:
            </p>
            <SuggestionChips onPick={send} disabled={busy} />
          </div>
        ) : (
          <MessageList messages={messages} status={status} />
        )}

        {error ? (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {humanizeError(error)}
          </div>
        ) : null}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-border px-4 pt-3 pb-4">
        {atTurnCap ? (
          <div className="rounded-lg border border-border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
            <p>This chat reached its {MAX_TURNS}-message limit.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={newChat}>
                <SquarePen className="size-3.5" />
                New chat
              </Button>
              <a href={CONTACT_HREF} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                Email Javier
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="flex items-end gap-2 rounded-xl border border-input bg-card px-3 py-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <label htmlFor="agent-input" className="sr-only">
                Message the portfolio agent
              </label>
              <textarea
                id="agent-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, INPUT_MAX_CHARS))}
                onKeyDown={onKeyDown}
                rows={1}
                maxLength={INPUT_MAX_CHARS}
                placeholder="Ask about a project, the stack, or how it was built…"
                className="max-h-32 min-h-6 flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {busy ? (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => stop()}
                  aria-label="Stop generating"
                >
                  <Square className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon-sm"
                  disabled={input.trim().length === 0}
                  aria-label="Send message"
                >
                  <ArrowUp className="size-4" />
                </Button>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <p className="text-[11px] text-muted-foreground">
                Traced with Langfuse. Routed to OpenRouter (paid) or Groq (free tier; may train on
                inputs).
              </p>
              <span
                className={cn(
                  "shrink-0 text-[11px] tabular-nums",
                  input.length >= INPUT_MAX_CHARS ? "text-warning" : "text-muted-foreground",
                )}
              >
                {input.length}/{INPUT_MAX_CHARS}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

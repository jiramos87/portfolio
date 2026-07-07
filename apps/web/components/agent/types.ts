import type { UIMessage } from "ai";
import type { AgentMetadata } from "@/lib/agent/prompt";

/**
 * The typed UI message the agent route streams. Its `metadata` carries the
 * source citations and the honesty flags (degraded / capped / servedBy) the
 * panel renders. `AgentMetadata` is a type-only import, so pulling it here does
 * not drag any server code into the client bundle.
 */
export type AgentUIMessage = UIMessage<AgentMetadata>;

/** Concatenate a message's text parts (the streamed reply body). */
export function messageText(message: AgentUIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

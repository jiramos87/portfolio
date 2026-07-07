import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/eyebrow";
import { ChatPanel } from "@/components/agent/chat-panel";

export const metadata: Metadata = {
  title: "Portfolio Agent | Javier Ramos",
  description:
    "Ask an AI agent about Javier Ramos's projects, stack, live GitHub activity, and how each exhibit was built. Grounded in the portfolio, with a source on every answer.",
};

export default function AgentPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Eyebrow>PORTFOLIO AGENT</Eyebrow>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Ask the agent</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A retrieval agent grounded in this portfolio, live GitHub activity, and its own eval. Every
        answer cites its sources. Pick a model, and ask in English or Spanish.
      </p>
      <div className="mt-8 h-[70vh] min-h-[32rem] overflow-hidden rounded-2xl border border-border shadow-sm">
        <ChatPanel />
      </div>
    </main>
  );
}

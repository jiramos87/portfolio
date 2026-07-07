/**
 * The Portfolio Agent's LangGraph.js pipeline, rendered inline as a themed SVG.
 *
 * Inlined (not a static /public/*.svg) on purpose: the site themes by a `.dark`
 * class (next-themes), which an external SVG file cannot see. Driving fills and
 * strokes from the raw CSS custom properties (--card, --border, --foreground,
 * --muted-foreground, --primary) lets the diagram recolor correctly when the
 * visitor toggles dark and light. Node names are load-bearing: they match the
 * graph nodes in lib/agent/graph.ts exactly (guardrail, retrieve, agent, answer).
 */

const NODES = [
  { title: "guardrail", sub: "topic + injection filter", x: 20 },
  { title: "retrieve", sub: "pgvector top-6", x: 260 },
  { title: "agent", sub: "github + eval tools", x: 500 },
  { title: "answer", sub: "grounded + cited", x: 740 },
] as const;

const NODE_W = 180;
const NODE_H = 72;
const NODE_Y = 52;

export function AgentGraphDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 960 160"
      role="img"
      aria-label="LangGraph pipeline: guardrail, then retrieve, then agent, then answer"
      className={className}
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <marker
          id="agent-graph-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" style={{ fill: "var(--muted-foreground)" }} />
        </marker>
      </defs>

      <text
        x={20}
        y={28}
        className="font-mono text-[11px] uppercase"
        style={{ fill: "var(--muted-foreground)", letterSpacing: "0.08em" }}
      >
        LangGraph.js orchestration
      </text>

      {NODES.slice(0, -1).map((node, i) => {
        const from = node.x + NODE_W + 4;
        const to = NODES[i + 1]!.x - 4;
        const y = NODE_Y + NODE_H / 2;
        return (
          <line
            key={`edge-${node.title}`}
            x1={from}
            y1={y}
            x2={to}
            y2={y}
            style={{ stroke: "var(--muted-foreground)", strokeWidth: 1.5 }}
            markerEnd="url(#agent-graph-arrow)"
          />
        );
      })}

      {NODES.map((node) => {
        const cx = node.x + NODE_W / 2;
        return (
          <g key={node.title}>
            <rect
              x={node.x}
              y={NODE_Y}
              width={NODE_W}
              height={NODE_H}
              rx={12}
              style={{
                fill: "var(--card)",
                stroke: "var(--primary)",
                strokeWidth: 1.5,
              }}
            />
            <text
              x={cx}
              y={NODE_Y + 32}
              textAnchor="middle"
              className="font-sans text-[16px] font-semibold"
              style={{ fill: "var(--foreground)" }}
            >
              {node.title}
            </text>
            <text
              x={cx}
              y={NODE_Y + 52}
              textAnchor="middle"
              className="font-mono text-[11px]"
              style={{ fill: "var(--muted-foreground)" }}
            >
              {node.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export interface TreeNode {
  id: string;
  label: string;
  count?: number;
  icon?: ReactNode;
  children?: TreeNode[];
}

interface Props {
  title: string;
  nodes: TreeNode[];
  defaultOpen?: string[];
}

function Node({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = (node.children?.length ?? 0) > 0;
  return (
    <div>
      <div
        data-sim={`node-${node.id}`}
        className="group flex cursor-pointer items-center gap-1 rounded-sm py-0.5 pr-2 text-[12px] hover:bg-black/5"
        style={{ paddingLeft: 6 + depth * 14, color: "var(--p-ink)" }}
        onClick={() => hasChildren && setOpen((o) => !o)}
      >
        {hasChildren ? (
          <ChevronRight
            className="h-3 w-3 shrink-0 transition-transform"
            style={{ transform: open ? "rotate(90deg)" : "none" }}
          />
        ) : (
          <span className="h-3 w-3" />
        )}
        {node.icon ?? <span className="h-3 w-3 rounded-sm" style={{ background: "var(--p-accent)" }} />}
        <span className="truncate">{node.label}</span>
        {typeof node.count === "number" && (
          <span className="ml-auto text-[10px] opacity-60">({node.count})</span>
        )}
      </div>
      {hasChildren && open && (
        <div>
          {node.children!.map((c) => (
            <Node key={c.id} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ModelTree({ title, nodes }: Props) {
  return (
    <div
      className="flex h-full w-64 shrink-0 flex-col"
      style={{ background: "var(--p-tree)", borderRight: "1px solid var(--p-line)" }}
    >
      <div
        className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
        style={{ borderBottom: "1px solid var(--p-line)", color: "var(--p-ink-soft)" }}
      >
        {title}
      </div>
      <div className="flex-1 overflow-auto py-1">
        {nodes.map((n) => (
          <Node key={n.id} node={n} depth={0} />
        ))}
      </div>
    </div>
  );
}

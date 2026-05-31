interface Props { items?: string[] }
export function StatusBar({ items = ["Ready", "1 simulation cached", "Units: m³/s"] }: Props) {
  return (
    <div
      className="flex items-center gap-4 px-3 py-1 font-mono text-[11px]"
      style={{
        background: "var(--p-status)",
        color: "var(--p-status-ink)",
        borderTop: "1px solid var(--p-line)",
      }}
      data-sim="statusbar"
    >
      {items.map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </div>
  );
}

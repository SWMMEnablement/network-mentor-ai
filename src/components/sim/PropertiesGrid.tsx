interface Row { label: string; value: string; unit?: string }
interface Props { title: string; rows: Row[] }

export function PropertiesGrid({ title, rows }: Props) {
  return (
    <div
      className="flex h-full w-72 shrink-0 flex-col"
      style={{ background: "var(--p-tree)", borderLeft: "1px solid var(--p-line)" }}
    >
      <div
        className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
        style={{ borderBottom: "1px solid var(--p-line)", color: "var(--p-ink-soft)" }}
      >
        {title}
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px]" data-sim="properties-grid">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--p-line)" }}>
                <td className="w-[55%] px-3 py-1" style={{ color: "var(--p-ink-soft)" }}>
                  {r.label}
                </td>
                <td className="px-3 py-1 font-mono" style={{ color: "var(--p-ink)" }}>
                  {r.value}
                  {r.unit && <span className="ml-1 opacity-60">{r.unit}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

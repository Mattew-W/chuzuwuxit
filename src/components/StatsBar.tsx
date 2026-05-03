interface StatsBarProps {
  totalRent: number
  totalElec: number
  totalWater: number
  grandTotal: number
  activeCount: number
  totalCount: number
}

export function StatsBar({ totalRent, totalElec, totalWater, grandTotal, activeCount, totalCount }: StatsBarProps) {
  return (
    <div className="px-4 pt-2 pb-0">
      {/* 总收入横幅 */}
      <div
        className="rounded-xl px-5 py-4 text-center mb-2"
        style={{ background: 'linear-gradient(135deg, #e86a3a, #c85830)' }}
      >
        <div className="text-white/70 text-[11px] font-medium">
          本月总收 · {activeCount}/{totalCount} 户
        </div>
        <div className="text-white text-3xl font-bold tracking-tight mt-0.5">
          ¥{grandTotal.toFixed(0)}
          <span className="text-base font-normal opacity-70">.{(grandTotal % 1).toFixed(2).slice(2)}</span>
        </div>
      </div>

      {/* 三项统计 */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="房租" value={totalRent} color="#c85830" />
        <Stat label="电费" value={totalElec} color="#d97706" />
        <Stat label="水费" value={totalWater} color="#2563eb" />
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="card px-3 py-2.5 text-center">
      <div className="text-[10px] text-[var(--text-sub)]">{label}</div>
      <div className="text-base font-semibold mt-0.5" style={{ color }}>¥{value.toFixed(0)}</div>
    </div>
  )
}

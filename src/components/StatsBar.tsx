interface Props {
  totalRent: number; totalElec: number; totalWater: number
  grandTotal: number; activeCount: number; totalCount: number
}

export function StatsBar({ totalRent, totalElec, totalWater, grandTotal, activeCount, totalCount }: Props) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-3 lg:max-w-[960px] lg:mx-auto">
      <div className="bg-[var(--brand)] rounded-[18px] px-5 py-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm opacity-80 font-medium">本月总收</span>
          <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full">{activeCount}/{totalCount} 户</span>
        </div>
        <div className="text-4xl font-bold tracking-tight mb-4">
          {grandTotal.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 2 })}
        </div>
        <div className="flex gap-3">
          {[
            { label: '房租', value: totalRent },
            { label: '电费', value: totalElec },
            { label: '水费', value: totalWater },
          ].map((item) => (
            <div key={item.label} className="flex-1 bg-white/10 rounded-xl px-3 py-2">
              <div className="text-[11px] opacity-70">{item.label}</div>
              <div className="text-sm font-semibold mt-0.5">
                {item.value.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface Props {
  totalRent: number; totalElec: number; totalWater: number
  grandTotal: number; activeCount: number; totalCount: number
}

export function StatsBar({ totalRent, totalElec, totalWater, grandTotal, activeCount, totalCount }: Props) {
  return (
    <div className="px-4 mb-3">
      <div className="bg-gradient-to-br from-[#e86a3a] to-[#c85830] rounded-xl p-4 text-white">
        <div className="text-sm opacity-90 mb-1">本月总应收 · {activeCount}/{totalCount} 户</div>
        <div className="text-3xl font-bold tracking-tight mb-3">¥{grandTotal.toLocaleString()}</div>
        <div className="flex justify-between text-xs bg-white/10 p-2 rounded-lg">
          <div className="text-center"><div>房租</div><div className="font-semibold mt-0.5">¥{totalRent}</div></div>
          <div className="text-center"><div>电费</div><div className="font-semibold mt-0.5">¥{totalElec}</div></div>
          <div className="text-center"><div>水费</div><div className="font-semibold mt-0.5">¥{totalWater}</div></div>
        </div>
      </div>
    </div>
  )
}

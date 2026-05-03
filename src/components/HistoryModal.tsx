import { useState, useEffect } from 'react'
import { getAllSnapshots } from '../lib/db'
import type { MonthSnapshot } from '../types'

interface Props {
  currentYear: number
  currentMonth: number
  onLoad: (year: number, month: number) => void
  onClose: () => void
}

export function HistoryModal({ currentYear, currentMonth, onLoad, onClose }: Props) {
  const [snapshots, setSnapshots] = useState<MonthSnapshot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const s = await getAllSnapshots()
      setSnapshots(s)
      setLoading(false)
    })()
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f3f0] safe-top safe-bottom overflow-auto">
      <div className="sticky top-0 z-10 bg-[#f5f3f0] px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <button onClick={onClose} className="text-2xl text-[#888]">×</button>
        <span className="text-base font-semibold">历史快照</span>
        <div className="w-6" />
      </div>

      <div className="p-4 max-w-[480px] mx-auto">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#888]">加载中...</div>
        ) : snapshots.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-sm text-[#888] mb-1">暂无历史快照</div>
            <div className="text-xs text-[#aaa]">每月结转时会自动保存</div>
          </div>
        ) : (
          <div className="space-y-2">
            {snapshots.map((snap) => {
              const isCurrent = snap.year === currentYear && snap.month === currentMonth
              const total = snap.rooms.reduce((sum, r) => {
                const e = Math.max(0, r.elecNow - r.elecLast) * snap.elecPrice
                const w = Math.max(0, r.waterNow - r.waterLast) * snap.waterPrice
                return sum + r.rent + e + w + r.hygiene + r.network
              }, 0)
              const months = ['','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

              return (
                <div
                  key={`${snap.year}-${snap.month}`}
                  onClick={() => { if (!isCurrent) { onLoad(snap.year, snap.month); onClose() } }}
                  className={`bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between cursor-pointer hover:border-[#2563eb] active:scale-[0.98] transition-all ${isCurrent ? 'opacity-40' : ''}`}
                >
                  <div>
                    <div className="text-sm font-semibold">
                      {snap.year}年{months[snap.month]}
                      {isCurrent && <span className="text-xs text-[#888] ml-1">(当前)</span>}
                    </div>
                    <div className="text-[11px] text-[#888]">
                      {snap.rooms.length} 间 · {new Date(snap.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#c85830]">{total.toFixed(0)}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

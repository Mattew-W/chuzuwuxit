import { useState, useEffect } from 'react'
import { BsXLg, BsClock } from 'react-icons/bs'
import { getAllSnapshots } from '../lib/db'
import type { MonthSnapshot } from '../types'

interface HistoryModalProps {
  currentYear: number
  currentMonth: number
  onLoad: (year: number, month: number) => void
  onClose: () => void
}

export function HistoryModal({ currentYear, currentMonth, onLoad, onClose }: HistoryModalProps) {
  const [snapshots, setSnapshots] = useState<MonthSnapshot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const snaps = await getAllSnapshots()
      setSnapshots(snaps)
      setLoading(false)
    })()
  }, [])

  const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[var(--app-bg)] safe-top animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card-bg)]">
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
          <BsXLg size={18} />
        </button>
        <span className="text-sm font-semibold">历史快照</span>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-auto px-4 py-4">
        {loading ? (
          <div className="text-center py-12 text-[var(--text-hint)] text-sm">加载中...</div>
        ) : snapshots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 opacity-30"><BsClock size={48} className="mx-auto" /></div>
            <div className="text-sm text-[var(--text-hint)]">暂无历史快照</div>
            <div className="text-xs text-[var(--text-hint)] mt-1">每月结转时会自动保存</div>
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

              return (
                <div
                  key={`${snap.year}-${snap.month}`}
                  onClick={() => !isCurrent && onLoad(snap.year, snap.month)}
                  className={`card p-4 flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-95 transition-all ${isCurrent ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#faf5f2] flex items-center justify-center">
                      <BsClock size={16} className="text-[#e86a3a]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {snap.year}年{monthNames[snap.month - 1]}
                        {isCurrent && <span className="text-[11px] text-[var(--text-hint)] ml-1">当前</span>}
                      </div>
                      <div className="text-[11px] text-[var(--text-sub)]">
                        {snap.rooms.length} 间 · {new Date(snap.createdAt).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                  </div>
                  <div className="text-base font-bold text-[#e86a3a]">¥{total.toFixed(2)}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

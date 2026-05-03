import { useState } from 'react'
import type { Room, CalcResult } from '../types'

interface Props {
  room: Room
  calc: CalcResult
  onDelete: (name: string) => void
  onPreview: (room: Room) => void
}

export function RoomCard({ room, calc, onDelete, onPreview }: Props) {
  const isVacant = room.status === 'vacant'
  const [del, setDel] = useState(false)

  return (
    <div className={`card mx-4 mb-2 overflow-hidden text-sm ${isVacant ? 'opacity-50' : ''}`}>
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#faf8f5] border-b border-[var(--border)]">
        <span className="font-bold">{room.name}</span>
        <div className="flex items-center gap-1">
          {del ? (
            <>
              <button onClick={() => { onDelete(room.name); setDel(false) }} className="w-6 h-6 flex items-center justify-center rounded bg-red-500 text-white text-xs font-bold">删</button>
              <button onClick={() => setDel(false)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 text-gray-500 text-xs">否</button>
            </>
          ) : (
            <button onClick={() => setDel(true)} className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-hint)] hover:bg-red-50 hover:text-red-400 text-sm">×</button>
          )}
        </div>
      </div>

      {/* 表头 */}
      <div className="grid grid-cols-8 gap-px bg-[var(--border)] text-center">
        <H>房租</H><H>电本月</H><H>电上月</H><H>用电</H>
        <H>水本月</H><H>水上月</H><H>用水</H><H>合计</H>
      </div>

      {/* 第一行数据 */}
      <div className="grid grid-cols-8 gap-px bg-[var(--border)]">
        <D v>{room.rent}</D>
        <D>{room.elecNow}</D>
        <D>{room.elecLast}</D>
        <D c="amber">{(room.elecNow > room.elecLast) ? calc.elecUsage : '-'}</D>
        <D>{room.waterNow}</D>
        <D>{room.waterLast}</D>
        <D c="blue">{(room.waterNow > room.waterLast) ? calc.waterUsage : '-'}</D>
        <D v b>¥{calc.total.toFixed(2)}</D>
      </div>

      {/* 第二行：费用细项 */}
      <div className="grid grid-cols-8 gap-px bg-[var(--border)] text-center">
        <D s>卫生 ¥{room.hygiene}</D>
        <D s>电费 ¥{calc.elecAmount.toFixed(2)}</D>
        <D s>网线 ¥{room.network}</D>
        <D s>水费 ¥{calc.waterAmount.toFixed(2)}</D>
        <D s>押金 ¥{room.deposit}</D>
        <D s>{!isVacant && room.remarks ? room.remarks : ''}</D>
        <D s />
        <D s>
          <button
            onClick={() => onPreview(room)}
            className="w-full py-1 rounded text-[11px] font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #e86a3a, #c85830)' }}
          >
            结算单
          </button>
        </D>
      </div>
    </div>
  )
}

function H({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#faf8f5] px-1 py-1.5 text-[10px] text-[var(--text-hint)]">{children}</div>
}

function D({ children, v, b, c, s }: { children?: React.ReactNode; v?: boolean; b?: boolean; c?: string; s?: boolean }) {
  const color = c === 'amber' ? '#d97706' : c === 'blue' ? '#2563eb' : v ? '#c85830' : 'var(--text-main)'
  const cls = s
    ? 'bg-white px-1 py-1 text-[10px]'
    : 'bg-white px-1 py-1.5 text-xs'
  return (
    <div className={cls} style={{ color, fontWeight: b ? 600 : 400 }}>
      {children ?? ''}
    </div>
  )
}

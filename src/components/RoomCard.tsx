import { useState } from 'react'
import type { Room, RoomCalc } from '../types'

interface Props {
  room: RoomCalc
  onUpdate: (name: string, field: keyof Room, value: number | string) => void
  onDelete: (name: string) => void
  onPreview: (room: RoomCalc) => void
}

export function RoomCard({ room, onUpdate, onDelete, onPreview }: Props) {
  const isVacant = room.status === 'vacant'
  const [editing, setEditing] = useState(false)
  const [delConfirm, setDelConfirm] = useState(false)

  if (editing) return <EditCard room={room} onUpdate={onUpdate} onClose={() => setEditing(false)} />

  return (
    <div className={`glass-panel transition-all duration-300 ${isVacant ? 'opacity-45 grayscale-[30%]' : ''}`}>
      {/* 头部：房号 + 合计 */}
      <div className="flex justify-between items-center px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-bold text-black/90">{room.name}</span>
          {isVacant && <span className="text-[11px] font-medium bg-black/5 text-black/50 px-2 py-0.5 rounded-full">空置</span>}
          {room.tenantNote && <span className="text-[10px] text-[var(--text-sub)]">{room.tenantNote}</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[18px] font-bold text-brand-gradient tabular-nums">
            {room.total.toFixed(2)}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setEditing(true)} className="text-[var(--text-sub)] hover:text-black/70 text-sm px-0.5">✎</button>
            {delConfirm ? (
              <div className="flex gap-0.5">
                <button onClick={() => { onDelete(room.name); setDelConfirm(false) }} className="text-red-500 font-bold text-[11px]">删</button>
                <button onClick={() => setDelConfirm(false)} className="text-[var(--text-sub)] text-[11px]">否</button>
              </div>
            ) : (
              <button onClick={() => setDelConfirm(true)} className="text-[var(--text-sub)] hover:text-red-500 text-lg leading-none">×</button>
            )}
          </div>
        </div>
      </div>

      {/* 数据表：7 列 */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[var(--text-sub)] font-medium mb-1.5 opacity-80">
          <div>房租</div>
          <div>电本月</div><div>电上月</div><div className="text-[#d97706]">用电</div>
          <div>水本月</div><div>水上月</div><div className="text-[#2563eb]">用水</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[13px] font-semibold text-black/80 tabular-nums items-center">
          <div>{room.rent}</div>
          <div>{room.elecNow}</div>
          <div>{room.elecLast}</div>
          <div className="text-[#d97706] text-[15px]">{room.elecNow > room.elecLast ? room.elecUsage : '-'}</div>
          <div>{room.waterNow}</div>
          <div>{room.waterLast}</div>
          <div className="text-[#2563eb] text-[15px]">{room.waterNow > room.waterLast ? room.waterUsage : '-'}</div>
        </div>

        {/* 细则：Pill 标签 */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-black/[0.04]">
          {[
            { label: '卫', val: room.hygiene },
            { label: '网', val: room.network },
            { label: '押', val: room.deposit },
          ].map((item) => (
            <span key={item.label} className="text-[11px] font-medium bg-white/60 border border-white/80 shadow-sm text-black/60 px-2 py-1 rounded-md">
              {item.label} {item.val}
            </span>
          ))}
          {room.elecAmount > 0 && <span className="text-[11px] font-medium bg-white/60 border border-white/80 shadow-sm text-[#d97706] px-2 py-1 rounded-md">电 {room.elecAmount.toFixed(2)}</span>}
          {room.waterAmount > 0 && <span className="text-[11px] font-medium bg-white/60 border border-white/80 shadow-sm text-[#2563eb] px-2 py-1 rounded-md">水 {room.waterAmount.toFixed(2)}</span>}
          {room.remarks && <span className="text-[11px] text-[var(--text-sub)] truncate max-w-[80px]">{room.remarks}</span>}
          <button
            onClick={() => onPreview(room)}
            className="ml-auto bg-gradient-to-r from-[var(--brand-start)] to-[var(--brand-end)] shadow-[0_4px_12px_rgba(242,107,58,0.25)] text-white px-4 py-1.5 rounded-full text-[12px] font-semibold active:scale-95 transition-transform"
          >结算单</button>
        </div>
      </div>
    </div>
  )
}

/* 编辑表单 */
function EditCard({ room, onUpdate, onClose }: { room: RoomCalc; onUpdate: Props['onUpdate']; onClose: () => void }) {
  const fields: [string, keyof Room, string][] = [
    ['房租', 'rent', 'number'], ['电本月', 'elecNow', 'number'], ['电上月', 'elecLast', 'number'],
    ['水本月', 'waterNow', 'number'], ['水上月', 'waterLast', 'number'],
    ['卫生', 'hygiene', 'number'], ['网线', 'network', 'number'], ['押金', 'deposit', 'number'],
  ]

  return (
    <div className="glass-panel !border-[var(--brand-start)] !border-2">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span className="text-sm font-bold text-[var(--brand-start)]">编辑 {room.name}</span>
        <button onClick={onClose} className="px-4 py-1.5 bg-gradient-to-r from-[var(--brand-start)] to-[var(--brand-end)] text-white rounded-full text-xs font-semibold">完成</button>
      </div>
      <div className="px-5 pb-4 grid grid-cols-4 gap-3">
        {fields.map(([label, field, type]) => (
          <div key={field}>
            <div className="text-[10px] text-[var(--text-sub)] mb-1">{label}</div>
            <input
              type={type}
              value={room[field]}
              onChange={(e) => onUpdate(room.name, field, type === 'number' ? Number(e.target.value) : e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white/60 text-xs focus:outline-none focus:border-[var(--brand-start)]"
              inputMode={type === 'number' ? 'decimal' : 'text'}
            />
          </div>
        ))}
        <div className="col-span-2">
          <div className="text-[10px] text-[var(--text-sub)] mb-1">备注</div>
          <input value={room.remarks} onChange={(e) => onUpdate(room.name, 'remarks', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white/60 text-xs focus:outline-none focus:border-[var(--brand-start)]" />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-sub)] mb-1">状态</div>
          <select value={room.status} onChange={(e) => onUpdate(room.name, 'status', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white/60 text-xs focus:outline-none focus:border-[var(--brand-start)]">
            <option value="active">在租</option>
            <option value="vacant">空置</option>
          </select>
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-sub)] mb-1">租客备注</div>
          <input value={room.tenantNote} onChange={(e) => onUpdate(room.name, 'tenantNote', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white/60 text-xs focus:outline-none focus:border-[var(--brand-start)]" />
        </div>
      </div>
    </div>
  )
}

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

  if (editing) return <EditForm room={room} onUpdate={onUpdate} onClose={() => setEditing(false)} />

  return (
    <div className={`bg-white rounded-[14px] mb-2 mx-4 sm:mx-6 lg:mx-8 lg:max-w-[960px] lg:mx-auto border border-[var(--border)] overflow-hidden ${isVacant ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#fafaf8] border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold tracking-tight">{room.name}</span>
          {isVacant && <span className="text-[10px] px-2 py-0.5 bg-[var(--border)] text-[var(--text-muted)] rounded-full font-medium leading-none pt-[3px] pb-[3px]">空置</span>}
          {room.tenantNote && <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[100px]">{room.tenantNote}</span>}
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => setEditing(true)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-black/5 text-[var(--text-muted)] text-xs transition-colors">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-9 9H2v-3z"/></svg>
          </button>
          {delConfirm ? (
            <div className="flex items-center gap-0.5">
              <button onClick={() => { onDelete(room.name); setDelConfirm(false) }} className="w-7 h-7 flex items-center justify-center rounded-md bg-red-500 text-white text-[10px] font-bold">删</button>
              <button onClick={() => setDelConfirm(false)} className="w-7 h-7 flex items-center justify-center rounded-md bg-[var(--border)] text-[var(--text-muted)] text-xs">否</button>
            </div>
          ) : (
            <button onClick={() => setDelConfirm(true)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-[var(--text-dim)] hover:text-red-400 text-sm transition-colors">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l8 8M12 4l-8 8"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="px-3 py-2.5">
        {/* Column headers */}
        <div className="grid grid-cols-8 text-center text-[10px] text-[var(--text-dim)] font-medium mb-1.5">
          <div>房租</div><div>电本月</div><div>电上月</div><div>用电</div>
          <div>水本月</div><div>水上月</div><div>用水</div><div>合计应收</div>
        </div>
        {/* Data row */}
        <div className="grid grid-cols-8 text-center text-xs mb-2.5">
          <T>{room.rent}</T>
          <T c="amber">{room.elecNow}</T>
          <T c="amber">{room.elecLast}</T>
          <T c="amber" b>{room.elecNow > room.elecLast ? room.elecUsage : '-'}</T>
          <T c="blue">{room.waterNow}</T>
          <T c="blue">{room.waterLast}</T>
          <T c="blue" b>{room.waterNow > room.waterLast ? room.waterUsage : '-'}</T>
          <T hl>¥{room.total.toFixed(2)}</T>
        </div>
        {/* Detail row */}
        <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] bg-[#f8f7f5] px-3 py-2 rounded-xl">
          <span>卫 {room.hygiene}</span>
          <Dot />
          <span style={{ color: '#d97706' }}>电 {room.elecAmount.toFixed(2)}</span>
          <Dot />
          <span>网 {room.network}</span>
          <Dot />
          <span style={{ color: '#2563eb' }}>水 {room.waterAmount.toFixed(2)}</span>
          <Dot />
          <span>押 {room.deposit}</span>
          {room.remarks && <><Dot /><span className="truncate">{room.remarks}</span></>}
          <div className="flex-1" />
          <button
            onClick={() => onPreview(room)}
            className="px-4 py-1.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white rounded-full text-[11px] font-semibold active:scale-95 transition-all"
          >结算单</button>
        </div>
      </div>
    </div>
  )
}

/* Table cell */
function T({ children, c, b, hl }: { children: React.ReactNode; c?: string; b?: boolean; hl?: boolean }) {
  const color = c === 'amber' ? '#c2410c' : c === 'blue' ? '#1d4ed8' : hl ? 'var(--brand)' : 'var(--text)'
  return <div className="font-medium py-0.5" style={{ color, fontWeight: b || hl ? 600 : 400, fontSize: hl ? '13px' : undefined }}>{children}</div>
}

function Dot() {
  return <div className="w-1 h-1 rounded-full bg-[var(--text-dim)] opacity-40 flex-shrink-0" />
}

/* ---- Edit Form ---- */
function EditForm({ room, onUpdate, onClose }: { room: RoomCalc; onUpdate: Props['onUpdate']; onClose: () => void }) {
  const fields: [string, keyof Room][] = [
    ['房租', 'rent'], ['电本月', 'elecNow'], ['电上月', 'elecLast'],
    ['水本月', 'waterNow'], ['水上月', 'waterLast'], ['卫生', 'hygiene'],
    ['网线', 'network'], ['押金', 'deposit'],
  ]

  return (
    <div className="bg-white rounded-[14px] mb-2 mx-4 sm:mx-6 lg:mx-8 lg:max-w-[960px] lg:mx-auto border-2 border-[var(--brand)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--brand-soft)]">
        <span className="text-sm font-semibold text-[var(--brand)]">编辑 {room.name}</span>
        <button onClick={onClose} className="px-4 py-1.5 bg-[var(--brand)] text-white rounded-full text-xs font-semibold active:scale-95 transition-all">完成</button>
      </div>
      <div className="p-4 grid grid-cols-4 gap-3">
        {fields.map(([label, field]) => (
          <div key={field}>
            <div className="text-[10px] text-[var(--text-muted)] mb-1">{label}</div>
            <input
              type="number"
              value={room[field]}
              onChange={(e) => onUpdate(room.name, field, Number(e.target.value))}
              className="w-full px-2.5 py-2 rounded-xl border border-[var(--border)] text-xs focus:outline-none focus:border-[var(--brand)] transition-colors"
              inputMode="decimal"
            />
          </div>
        ))}
        <div className="col-span-4 grid grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] text-[var(--text-muted)] mb-1">备注</div>
            <input value={room.remarks} onChange={(e) => onUpdate(room.name, 'remarks', e.target.value)} className="w-full px-2.5 py-2 rounded-xl border border-[var(--border)] text-xs focus:outline-none focus:border-[var(--brand)]" />
          </div>
          <div>
            <div className="text-[10px] text-[var(--text-muted)] mb-1">状态</div>
            <select value={room.status} onChange={(e) => onUpdate(room.name, 'status', e.target.value)} className="w-full px-2.5 py-2 rounded-xl border border-[var(--border)] text-xs focus:outline-none focus:border-[var(--brand)] bg-white">
              <option value="active">在租</option>
              <option value="vacant">空置</option>
            </select>
          </div>
          <div>
            <div className="text-[10px] text-[var(--text-muted)] mb-1">租客备注</div>
            <input value={room.tenantNote} onChange={(e) => onUpdate(room.name, 'tenantNote', e.target.value)} className="w-full px-2.5 py-2 rounded-xl border border-[var(--border)] text-xs focus:outline-none focus:border-[var(--brand)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

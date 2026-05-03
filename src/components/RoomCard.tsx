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

  if (editing) {
    return <EditForm room={room} onUpdate={onUpdate} onClose={() => setEditing(false)} />
  }

  return (
    <div className={`bg-white rounded-lg mb-2 mx-4 overflow-hidden transition-opacity ${isVacant ? 'opacity-50' : ''}`}>
      {/* 表头 */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#faf8f5] border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{room.name}</span>
          {isVacant && <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">空置</span>}
          {room.tenantNote && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded truncate max-w-[80px]">{room.tenantNote}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setEditing(true)} className="w-7 h-7 flex items-center justify-center rounded text-[#888] hover:bg-gray-100 text-xs">✎</button>
          {delConfirm ? (
            <>
              <button onClick={() => { onDelete(room.name); setDelConfirm(false) }} className="w-7 h-7 flex items-center justify-center rounded bg-red-500 text-white text-xs font-bold">删</button>
              <button onClick={() => setDelConfirm(false)} className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 text-gray-500 text-xs">否</button>
            </>
          ) : (
            <button onClick={() => setDelConfirm(true)} className="w-7 h-7 flex items-center justify-center rounded text-[#888] hover:bg-red-50 hover:text-red-400">×</button>
          )}
        </div>
      </div>

      {/* 微型表格 */}
      <div className="p-2">
        <div className="grid grid-cols-8 gap-0.5 text-center text-[10px] text-[#888] mb-0.5">
          <div>房租</div><div>电本月</div><div>电上月</div><div>用电</div>
          <div>水本月</div><div>水上月</div><div>用水</div><div>合计</div>
        </div>
        <div className="grid grid-cols-8 gap-0.5 text-center text-xs font-medium mb-2">
          <C>{room.rent}</C>
          <C c="amber">{room.elecNow}</C>
          <C c="amber">{room.elecLast}</C>
          <C c="amber" b>{room.elecNow > room.elecLast ? room.elecUsage : '-'}</C>
          <C c="blue">{room.waterNow}</C>
          <C c="blue">{room.waterLast}</C>
          <C c="blue" b>{room.waterNow > room.waterLast ? room.waterUsage : '-'}</C>
          <C c="red" b l>¥{room.total.toFixed(2)}</C>
        </div>

        <div className="flex items-center gap-2 text-[11px] bg-[#f5f3f0] px-2 py-1.5 rounded text-[#888] flex-wrap">
          <span>卫{room.hygiene}</span>
          <span className="text-[#d97706]">电{room.elecAmount.toFixed(2)}</span>
          <span>网{room.network}</span>
          <span className="text-[#2563eb]">水{room.waterAmount.toFixed(2)}</span>
          <span>押{room.deposit}</span>
          {room.remarks && <span className="truncate max-w-[60px]">{room.remarks}</span>}
          <button
            onClick={() => onPreview(room)}
            className="ml-auto bg-gradient-to-r from-[#e86a3a] to-[#c85830] text-white px-3 py-1 rounded-full text-[11px] font-medium active:scale-95 transition-transform"
          >结算单</button>
        </div>
      </div>
    </div>
  )
}

function C({ children, c, b, l }: { children: React.ReactNode; c?: string; b?: boolean; l?: boolean }) {
  const color = c === 'amber' ? '#d97706' : c === 'blue' ? '#2563eb' : c === 'red' ? '#c85830' : '#1a1a1a'
  return <div style={{ color, fontWeight: b ? 600 : 400, fontSize: l ? '13px' : undefined }}>{children}</div>
}

/* ---- 编辑表单 ---- */
function EditForm({ room, onUpdate, onClose }: { room: RoomCalc; onUpdate: Props['onUpdate']; onClose: () => void }) {
  const fields: { label: string; field: keyof Room; type: string }[] = [
    { label: '房租', field: 'rent', type: 'number' },
    { label: '电本月', field: 'elecNow', type: 'number' },
    { label: '电上月', field: 'elecLast', type: 'number' },
    { label: '水本月', field: 'waterNow', type: 'number' },
    { label: '水上月', field: 'waterLast', type: 'number' },
    { label: '卫生', field: 'hygiene', type: 'number' },
    { label: '网线', field: 'network', type: 'number' },
    { label: '押金', field: 'deposit', type: 'number' },
  ]

  return (
    <div className="bg-white rounded-lg mb-2 mx-4 p-3 border border-[#e86a3a]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#e86a3a]">编辑 {room.name}</span>
        <button onClick={onClose} className="px-3 py-1 bg-[#e86a3a] text-white rounded-full text-xs font-semibold">完成</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {fields.map(({ label, field, type }) => (
          <div key={field}>
            <div className="text-[10px] text-[#888] mb-0.5">{label}</div>
            <input
              type={type}
              value={room[field]}
              onChange={(e) => onUpdate(room.name, field, type === 'number' ? Number(e.target.value) : e.target.value)}
              className="w-full px-2 py-1.5 rounded text-xs border border-gray-200 focus:outline-none focus:border-[#e86a3a]"
              inputMode="decimal"
            />
          </div>
        ))}
        <div className="col-span-2">
          <div className="text-[10px] text-[#888] mb-0.5">备注</div>
          <input
            value={room.remarks}
            onChange={(e) => onUpdate(room.name, 'remarks', e.target.value)}
            className="w-full px-2 py-1.5 rounded text-xs border border-gray-200 focus:outline-none focus:border-[#e86a3a]"
          />
        </div>
        <div>
          <div className="text-[10px] text-[#888] mb-0.5">状态</div>
          <select
            value={room.status}
            onChange={(e) => onUpdate(room.name, 'status', e.target.value)}
            className="w-full px-2 py-1.5 rounded text-xs border border-gray-200 focus:outline-none focus:border-[#e86a3a]"
          >
            <option value="active">在租</option>
            <option value="vacant">空置</option>
          </select>
        </div>
        <div>
          <div className="text-[10px] text-[#888] mb-0.5">租客备注</div>
          <input
            value={room.tenantNote}
            onChange={(e) => onUpdate(room.name, 'tenantNote', e.target.value)}
            className="w-full px-2 py-1.5 rounded text-xs border border-gray-200 focus:outline-none focus:border-[#e86a3a]"
          />
        </div>
      </div>
    </div>
  )
}

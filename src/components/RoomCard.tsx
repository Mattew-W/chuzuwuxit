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
    return <EditCard room={room} onUpdate={onUpdate} onClose={() => setEditing(false)} />
  }

  return (
    <div className={`bg-white rounded-lg mb-3 mx-4 sm:mx-6 lg:max-w-[960px] lg:mx-auto overflow-hidden transition-opacity ${isVacant ? 'opacity-50' : 'opacity-100'}`}>
      {/* 表头区 */}
      <div className="flex justify-between items-center px-3 py-2 bg-[#faf8f5] border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-[#1a1a1a]">{room.name}</span>
          {isVacant && <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">空置</span>}
          {room.tenantNote && <span className="text-[10px] text-[#888] truncate max-w-[80px]">{room.tenantNote}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setEditing(true)} className="text-[#888] hover:text-[#1a1a1a] text-sm px-1">✎</button>
          {delConfirm ? (
            <>
              <button onClick={() => { onDelete(room.name); setDelConfirm(false) }} className="text-red-500 font-bold text-xs px-1">删</button>
              <button onClick={() => setDelConfirm(false)} className="text-[#888] text-xs px-1">否</button>
            </>
          ) : (
            <button onClick={() => setDelConfirm(true)} className="text-[#888] hover:text-red-500 text-xl leading-none px-1">×</button>
          )}
        </div>
      </div>

      {/* 微型表格区 */}
      <div className="p-2">
        <div className="grid grid-cols-8 gap-1 text-center text-[10px] text-[#888] mb-1">
          <div>房租</div><div>电本月</div><div>电上月</div><div>用电</div>
          <div>水本月</div><div>水上月</div><div>用水</div><div>合计</div>
        </div>
        <div className="grid grid-cols-8 gap-1 text-center text-xs font-medium text-[#1a1a1a] mb-3 items-center">
          <div>{room.rent}</div>
          <div className="text-[#d97706]">{room.elecNow}</div>
          <div className="text-[#d97706]">{room.elecLast}</div>
          <div className="text-[#d97706] font-bold">{room.elecUsage}</div>
          <div className="text-[#2563eb]">{room.waterNow}</div>
          <div className="text-[#2563eb]">{room.waterLast}</div>
          <div className="text-[#2563eb] font-bold">{room.waterUsage}</div>
          <div className="text-[#2563eb] font-bold text-sm">{room.total}</div>
        </div>

        {/* 细则与操作行 */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] bg-[#f5f3f0] p-1.5 rounded text-[#888]">
          <span>卫生{room.hygiene}</span>
          <span>电费{room.elecAmount}</span>
          <span>网线{room.network}</span>
          <span>水费{room.waterAmount}</span>
          <span>押{room.deposit}</span>
          {room.remarks && <span className="truncate max-w-[60px]">备:{room.remarks}</span>}
          <button
            onClick={() => onPreview(room)}
            className="ml-auto bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white px-3 py-1 rounded-full font-medium"
          >结算单</button>
        </div>
      </div>
    </div>
  )
}

/* ---- 编辑表单 ---- */
function EditCard({ room, onUpdate, onClose }: { room: RoomCalc; onUpdate: Props['onUpdate']; onClose: () => void }) {
  const fields: [string, keyof Room, string][] = [
    ['房租', 'rent', 'number'], ['电本月', 'elecNow', 'number'], ['电上月', 'elecLast', 'number'],
    ['水本月', 'waterNow', 'number'], ['水上月', 'waterLast', 'number'],
    ['卫生', 'hygiene', 'number'], ['网线', 'network', 'number'], ['押金', 'deposit', 'number'],
  ]

  return (
    <div className="bg-white rounded-lg mb-3 mx-4 sm:mx-6 lg:max-w-[960px] lg:mx-auto overflow-hidden border-2 border-[#2563eb]">
      <div className="flex justify-between items-center px-3 py-2 bg-[#eff6ff]">
        <span className="text-sm font-semibold text-[#2563eb]">编辑 {room.name}</span>
        <button onClick={onClose} className="px-3 py-1 bg-[#2563eb] text-white rounded-full text-xs font-semibold">完成</button>
      </div>
      <div className="p-3 grid grid-cols-4 gap-2">
        {fields.map(([label, field, type]) => (
          <div key={field}>
            <div className="text-[10px] text-[#888] mb-0.5">{label}</div>
            <input
              type={type}
              value={room[field]}
              onChange={(e) => {
                const v = type === 'number' ? Number(e.target.value) : e.target.value
                onUpdate(room.name, field, v)
              }}
              className="w-full px-2 py-1.5 rounded text-xs border border-gray-200 focus:outline-none focus:border-[#2563eb]"
              inputMode={type === 'number' ? 'decimal' : 'text'}
            />
          </div>
        ))}
        <div className="col-span-2">
          <div className="text-[10px] text-[#888] mb-0.5">备注</div>
          <input value={room.remarks} onChange={(e) => onUpdate(room.name, 'remarks', e.target.value)} className="w-full px-2 py-1.5 rounded text-xs border border-gray-200 focus:outline-none focus:border-[#e86a3a]" />
        </div>
        <div>
          <div className="text-[10px] text-[#888] mb-0.5">状态</div>
          <select value={room.status} onChange={(e) => onUpdate(room.name, 'status', e.target.value)} className="w-full px-2 py-1.5 rounded text-xs border border-gray-200 focus:outline-none focus:border-[#e86a3a] bg-white">
            <option value="active">在租</option>
            <option value="vacant">空置</option>
          </select>
        </div>
        <div>
          <div className="text-[10px] text-[#888] mb-0.5">租客备注</div>
          <input value={room.tenantNote} onChange={(e) => onUpdate(room.name, 'tenantNote', e.target.value)} className="w-full px-2 py-1.5 rounded text-xs border border-gray-200 focus:outline-none focus:border-[#e86a3a]" />
        </div>
      </div>
    </div>
  )
}

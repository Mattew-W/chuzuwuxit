import { useState } from 'react'
import { useData } from './hooks/useData'
import { Toast } from './components/Toast'
import { RoomCard } from './components/RoomCard'
import { ReceiptModal } from './components/ReceiptModal'
import { SettingsModal } from './components/SettingsModal'
import { HistoryModal } from './components/HistoryModal'
import type { RoomCalc } from './types'

export default function App() {
  const {
    rooms, calcRooms, settings, year, month, totals,
    loading, toast,
    updateRoom, addRoom, removeRoom,
    updateSettings, carryOver, loadMonth,
    setRoomsDirect, snapYear, snapMonth,
  } = useData()

  const [receiptRoom, setReceiptRoom] = useState<RoomCalc | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const goPrev = () => month === 1 ? (snapYear(year - 1), snapMonth(12)) : snapMonth(month - 1)
  const goNext = () => month === 12 ? (snapYear(year + 1), snapMonth(1)) : snapMonth(month + 1)

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f5f3f0] text-sm text-[#888]">Loading...</div>
  }

  return (
    <div className="min-h-screen pb-24 bg-[#f5f3f0]">
      <Toast msg={toast} />

      {/* 顶部导航与操作行 */}
      <header className="sticky top-0 z-10 bg-[#f5f3f0] px-4 py-3 pb-2 safe-top">
        <div className="flex justify-between items-center mb-3 lg:max-w-[960px] lg:mx-auto">
          <div className="flex items-center gap-3 text-lg font-bold">
            <button onClick={goPrev} className="text-[#888]">←</button>
            <span>{year}年{month}月</span>
            <button onClick={goNext} className="text-[#888]">→</button>
          </div>
          <button onClick={() => setShowSettings(true)} className="text-xl">⚙</button>
        </div>
        <div className="flex justify-between gap-3 lg:max-w-[960px] lg:mx-auto">
          <button onClick={() => setShowHistory(true)} className="flex-1 bg-white border border-gray-200 py-1.5 rounded-full text-sm font-medium text-[#1a1a1a]">
            历史快照
          </button>
          <button onClick={carryOver} className="flex-1 bg-white border border-gray-200 py-1.5 rounded-full text-sm font-medium text-[#1a1a1a]">
            结转下月
          </button>
        </div>
      </header>

      {/* 统计大横幅 */}
      <div className="px-4 mb-4 lg:max-w-[960px] lg:mx-auto">
        <div className="bg-gradient-to-br from-[#e86a3a] to-[#c85830] rounded-xl p-4 text-white shadow-sm">
          <div className="text-sm opacity-90 mb-1">本月总应收 · {totals.activeCount}/{totals.totalCount}户</div>
          <div className="text-3xl font-bold tracking-tight mb-3">{totals.grandTotal.toLocaleString()}</div>
          <div className="flex justify-between text-xs bg-black/10 p-2 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col items-center"><span>房租</span><span className="font-semibold">{totals.totalRent}</span></div>
            <div className="flex flex-col items-center"><span>电费</span><span className="font-semibold">{totals.totalElec}</span></div>
            <div className="flex flex-col items-center"><span>水费</span><span className="font-semibold">{totals.totalWater}</span></div>
          </div>
        </div>
      </div>

      {/* 房间列表 */}
      <main className="flex-1">
        {rooms.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-sm text-[#888] mb-4">还没有房间数据</div>
            <button onClick={addRoom} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e86a3a] text-white rounded-full text-sm font-semibold active:scale-95">
              ＋ 添加房间
            </button>
          </div>
        ) : (
          calcRooms.map((room) => (
            <RoomCard
              key={room.name}
              room={room}
              onUpdate={updateRoom}
              onDelete={removeRoom}
              onPreview={setReceiptRoom}
            />
          ))
        )}
      </main>

      {/* 悬浮添加按钮 */}
      {rooms.length > 0 && (
        <button onClick={addRoom} className="fixed bottom-6 right-5 w-14 h-14 bg-[#e86a3a] text-white rounded-full flex items-center justify-center text-3xl shadow-lg active:scale-90 transition-all z-20">
          ＋
        </button>
      )}

      {/* 弹窗 */}
      {receiptRoom && (
        <ReceiptModal
          room={receiptRoom}
          calc={{ elecUsage: receiptRoom.elecUsage, elecAmount: receiptRoom.elecAmount, waterUsage: receiptRoom.waterUsage, waterAmount: receiptRoom.waterAmount, total: receiptRoom.total }}
          year={year} month={month} elecPrice={settings.elecPrice} waterPrice={settings.waterPrice}
          onClose={() => setReceiptRoom(null)}
        />
      )}
      {showSettings && (
        <SettingsModal settings={settings} rooms={rooms} year={year} month={month}
          onUpdateSettings={updateSettings} onImportRooms={setRoomsDirect} onClose={() => setShowSettings(false)} />
      )}
      {showHistory && (
        <HistoryModal currentYear={year} currentMonth={month} onLoad={loadMonth} onClose={() => setShowHistory(false)} />
      )}
    </div>
  )
}

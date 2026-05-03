import { useState } from 'react'
import { BsPlusLg, BsGear } from 'react-icons/bs'
import { useData } from './hooks/useData'
import { Toast } from './components/Toast'
import { StatsBar } from './components/StatsBar'
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
    return <div className="min-h-dvh flex items-center justify-center bg-[#f5f3f0] text-sm text-[#888]">加载中...</div>
  }

  return (
    <div className="max-w-[480px] mx-auto min-h-dvh bg-[#f5f3f0] pb-20">
      <Toast msg={toast} />

      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-[#f5f3f0] safe-top px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={goPrev} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[#888]">
            <svg width="14" height="14" viewBox="0 0 16 16"><path d="M10.5 3L5.5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <span className="text-lg font-bold">{year}年{month}月</span>
          <button onClick={goNext} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[#888]">
            <svg width="14" height="14" viewBox="0 0 16 16"><path d="M5.5 3L10.5 8l-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHistory(true)} className="flex-1 bg-white border border-gray-200 py-1.5 rounded-full text-sm font-medium">历史快照</button>
          <button onClick={carryOver} className="flex-1 bg-gradient-to-r from-[#e86a3a] to-[#c85830] text-white py-1.5 rounded-full text-sm font-semibold active:scale-95 transition-transform">结转下月</button>
          <button onClick={() => setShowSettings(true)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[#888]">
            <BsGear size={15} />
          </button>
        </div>
      </header>

      {/* 统计横幅 */}
      <StatsBar
        totalRent={totals.totalRent}
        totalElec={totals.totalElec}
        totalWater={totals.totalWater}
        grandTotal={totals.grandTotal}
        activeCount={totals.activeCount}
        totalCount={totals.totalCount}
      />

      {/* 房间列表 */}
      <main className="mt-2">
        {rooms.length === 0 ? (
          <div className="text-center py-20 text-sm text-[#888]">
            <p className="mb-3">还没有房间</p>
            <button onClick={addRoom} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#e86a3a] to-[#c85830] text-white rounded-full text-sm font-semibold active:scale-95">
              <BsPlusLg size={14} />添加房间
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

      {/* 悬浮加号 */}
      {rooms.length > 0 && (
        <button onClick={addRoom} className="fixed bottom-6 right-5 w-12 h-12 bg-gradient-to-r from-[#e86a3a] to-[#c85830] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all z-20">
          <BsPlusLg size={22} />
        </button>
      )}

      {/* 弹窗 */}
      {receiptRoom && (
        <ReceiptModal
          room={receiptRoom}
          calc={{ elecUsage: receiptRoom.elecUsage, elecAmount: receiptRoom.elecAmount, waterUsage: receiptRoom.waterUsage, waterAmount: receiptRoom.waterAmount, total: receiptRoom.total }}
          year={year} month={month}
          elecPrice={settings.elecPrice} waterPrice={settings.waterPrice}
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

import { useState } from 'react'
import { BsPlusLg, BsGear } from 'react-icons/bs'
import { useData } from './hooks/useData'
import { calcRoom } from './lib/calculator'
import { Toast } from './components/Toast'
import { StatsBar } from './components/StatsBar'
/* MonthHeader inlined in App */
import { RoomCard } from './components/RoomCard'
import { ReceiptModal } from './components/ReceiptModal'
import { SettingsModal } from './components/SettingsModal'
import { HistoryModal } from './components/HistoryModal'
import type { Room } from './types'

export default function App() {
  const {
    rooms, settings, year, month, totals,
    loading, toast,
    updateRoom: _updateRoom, addRoom, removeRoom,
    updateSettings, carryOver, loadMonth,
    setRoomsDirect, snapYear, snapMonth,
  } = useData()

  const [receiptRoom, setReceiptRoom] = useState<Room | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const goPrev = () => month === 1 ? (snapYear(year - 1), snapMonth(12)) : snapMonth(month - 1)
  const goNext = () => month === 12 ? (snapYear(year + 1), snapMonth(1)) : snapMonth(month + 1)

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--app-bg)]">
        <div className="text-center text-[var(--text-sub)] text-sm">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[var(--app-bg)] pb-20">
      <Toast msg={toast} />

      {/* ---- Top bar: month nav + actions ---- */}
      <div className="safe-top px-4 pt-3 pb-2 flex items-center justify-between">
        <button onClick={goPrev} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[var(--text-sub)]">
          <svg width="14" height="14" viewBox="0 0 16 16"><path d="M10.5 3L5.5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        <div className="text-center select-none">
          <div className="text-base font-bold tracking-tight">{year}年{month}月</div>
        </div>

        <button onClick={goNext} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[var(--text-sub)]">
          <svg width="14" height="14" viewBox="0 0 16 16"><path d="M5.5 3L10.5 8l-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* ---- Action row ---- */}
      <div className="px-4 pb-2 flex items-center gap-2">
        <button
          onClick={() => setShowHistory(true)}
          className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-sub)] hover:text-[var(--text-main)] active:bg-gray-50 transition-colors"
        >
          历史快照
        </button>
        <button
          onClick={carryOver}
          className="text-[11px] font-semibold px-4 py-1.5 rounded-full text-white active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #e86a3a, #c85830)' }}
        >
          结转下月
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowSettings(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[var(--text-sub)]"
        >
          <BsGear size={15} />
        </button>
      </div>

      {/* ---- Stats ---- */}
      <StatsBar
        totalRent={totals.totalRent}
        totalElec={totals.totalElec}
        totalWater={totals.totalWater}
        grandTotal={totals.grandTotal}
        activeCount={totals.activeCount}
        totalCount={totals.totalCount}
      />

      {/* ---- Room list ---- */}
      <div className="mt-2">
        {rooms.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="text-sm text-[var(--text-sub)] mb-2">还没有房间</div>
            <button
              onClick={addRoom}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #e86a3a, #c85830)' }}
            >
              <BsPlusLg size={14} />
              添加房间
            </button>
          </div>
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.name}
              room={room}
              calc={calcRoom(room, settings.elecPrice, settings.waterPrice)}
              onDelete={removeRoom}
              onPreview={setReceiptRoom}
            />
          ))
        )}
      </div>

      {/* ---- Floating add button ---- */}
      {rooms.length > 0 && (
        <button
          onClick={addRoom}
          className="fixed bottom-6 right-5 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all z-20"
          style={{ background: 'linear-gradient(135deg, #e86a3a, #c85830)', boxShadow: '0 4px 16px rgba(200,88,48,0.35)' }}
        >
          <BsPlusLg size={22} />
        </button>
      )}

      {/* ---- Modals ---- */}
      {receiptRoom && (
        <ReceiptModal
          room={receiptRoom}
          calc={calcRoom(receiptRoom, settings.elecPrice, settings.waterPrice)}
          year={year} month={month}
          elecPrice={settings.elecPrice}
          waterPrice={settings.waterPrice}
          onClose={() => setReceiptRoom(null)}
        />
      )}
      {showSettings && (
        <SettingsModal
          settings={settings}
          rooms={rooms}
          year={year} month={month}
          onUpdateSettings={updateSettings}
          onImportRooms={setRoomsDirect}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showHistory && (
        <HistoryModal
          currentYear={year}
          currentMonth={month}
          onLoad={loadMonth}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  )
}

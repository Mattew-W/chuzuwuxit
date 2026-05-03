import { useState } from 'react'
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

  if (loading) return <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-muted)]">Loading...</div>

  return (
    <div className="min-h-dvh bg-[var(--bg)] pb-24">
      <Toast msg={toast} />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bg)]/80 backdrop-blur-xl safe-top border-b border-transparent">
        <div className="px-4 sm:px-6 lg:px-8 py-3 lg:max-w-[960px] lg:mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <button onClick={goPrev} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-[var(--text-muted)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="text-lg font-bold tracking-tight">{year}年{month}月</span>
            <button onClick={goNext} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-[var(--text-muted)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="flex-1 bg-white border border-[var(--border)] py-2 rounded-full text-[13px] font-medium text-[var(--text)] hover:border-[var(--border-hover)] transition-colors"
            >历史快照</button>
            <button
              onClick={carryOver}
              className="flex-1 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white py-2 rounded-full text-[13px] font-semibold active:scale-[0.97] transition-all"
            >结转下月</button>
            <button
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-[var(--text-muted)] transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <StatsBar
        totalRent={totals.totalRent} totalElec={totals.totalElec} totalWater={totals.totalWater}
        grandTotal={totals.grandTotal} activeCount={totals.activeCount} totalCount={totals.totalCount}
      />

      {/* Room List */}
      <main className="mt-2">
        {rooms.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-sm text-[var(--text-muted)] mb-4">还没有房间数据</div>
            <button onClick={addRoom} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white rounded-full text-sm font-semibold active:scale-95 transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              添加房间
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

      {/* FAB */}
      {rooms.length > 0 && (
        <button onClick={addRoom} className="fixed bottom-6 right-5 sm:right-8 w-12 h-12 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white rounded-full flex items-center justify-center shadow-lg shadow-[var(--brand)]/20 active:scale-90 transition-all z-30">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      )}

      {/* Modals */}
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

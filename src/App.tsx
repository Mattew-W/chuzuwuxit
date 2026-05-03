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
    return <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] text-sm text-[var(--text-sub)]">Loading...</div>
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Toast msg={toast} />

      {/* 光学散景背景 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#f26b3a]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#2563eb]/5 rounded-full blur-[100px]" />
      </div>

      {/* UI 层 */}
      <div className="relative z-10 max-w-[1024px] lg:max-w-[960px] mx-auto pb-[calc(env(safe-area-inset-bottom,16px)+80px)]">

        {/* Header：毛玻璃 */}
        <header className="sticky top-0 z-20 pt-[env(safe-area-inset-top)] bg-white/40 backdrop-blur-2xl border-b border-white/50 shadow-sm">
          <div className="px-5 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={goPrev} className="text-[var(--text-sub)] hover:text-black transition-colors text-xl">←</button>
              <span className="text-[19px] font-bold tracking-wide tabular-nums text-black/90">{year}年{month}月</span>
              <button onClick={goNext} className="text-[var(--text-sub)] hover:text-black transition-colors text-xl">→</button>
            </div>
            <button onClick={() => setShowSettings(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/60 border border-white/80 shadow-sm text-[var(--text-sub)] hover:text-[var(--brand-start)] transition-all active:scale-95 text-lg">
              ⚙
            </button>
          </div>
          <div className="px-5 pb-3 flex gap-3">
            <button onClick={() => setShowHistory(true)} className="flex-1 py-1.5 rounded-full bg-white/60 border border-white/80 text-sm font-medium text-[var(--text-sub)] hover:text-black/70 transition-colors">
              历史快照
            </button>
            <button onClick={carryOver} className="flex-1 py-1.5 rounded-full bg-gradient-to-r from-[var(--brand-start)] to-[var(--brand-end)] text-white text-sm font-semibold shadow-sm active:scale-95 transition-transform">
              结转下月
            </button>
          </div>
        </header>

        <main className="px-4 tablet:px-8 pt-5">
          {/* 统计横幅 */}
          <div className="glass-panel p-6 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-medium text-[var(--text-sub)] tracking-widest">本月总收</span>
              <span className="text-[11px] font-semibold bg-black/5 text-black/60 px-2.5 py-0.5 rounded-full tabular-nums border border-black/5">
                {totals.activeCount}/{totals.totalCount} 户
              </span>
            </div>
            <div className="text-[42px] font-extrabold tracking-tighter tabular-nums mb-6 text-brand-gradient drop-shadow-sm">
              {totals.grandTotal.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '房租', value: totals.totalRent.toLocaleString() },
                { label: '电费', value: totals.totalElec.toLocaleString(), color: 'text-[#d97706]' },
                { label: '水费', value: totals.totalWater.toLocaleString(), color: 'text-[#2563eb]' },
              ].map((item) => (
                <div key={item.label} className="bg-white/50 rounded-[14px] p-3 px-4 border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]">
                  <div className="text-[11px] font-medium text-[var(--text-sub)] mb-1">{item.label}</div>
                  <div className={`text-[15px] font-bold tabular-nums ${item.color || 'text-black/80'}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 房间列表 */}
          <div className="space-y-3">
            {rooms.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-sm text-[var(--text-sub)] mb-4">还没有房间数据</div>
                <button onClick={addRoom} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--brand-start)] to-[var(--brand-end)] text-white rounded-full text-sm font-semibold active:scale-95 transition-transform">
                  ＋ 添加房间
                </button>
              </div>
            ) : (
              calcRooms.map((room) => (
                <RoomCard key={room.name} room={room} onUpdate={updateRoom} onDelete={removeRoom} onPreview={setReceiptRoom} />
              ))
            )}
          </div>
        </main>
      </div>

      {/* FAB */}
      {rooms.length > 0 && (
        <button onClick={addRoom} className="fixed bottom-6 right-5 w-14 h-14 bg-gradient-to-r from-[var(--brand-start)] to-[var(--brand-end)] text-white rounded-full flex items-center justify-center text-3xl shadow-[0_4px_16px_rgba(242,107,58,0.3)] active:scale-90 transition-all z-30">
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

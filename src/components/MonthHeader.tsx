import { BsChevronLeft, BsChevronRight, BsArrowRight, BsCalendar3 } from 'react-icons/bs'

interface MonthHeaderProps {
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
  onCarryOver: () => void
  onLoadHistory: () => void
}

export function MonthHeader({ year, month, onPrev, onNext, onCarryOver, onLoadHistory }: MonthHeaderProps) {
  const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

  return (
    <div className="safe-top px-4 pt-4 pb-2">
      <div className="flex items-center justify-between">
        <button onClick={onPrev} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
          <BsChevronLeft size={18} className="text-[var(--text-sub)]" />
        </button>

        <div className="text-center select-none">
          <div className="text-lg font-semibold tracking-tight">
            {year}年{monthNames[month - 1]}
          </div>
        </div>

        <button onClick={onNext} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
          <BsChevronRight size={18} className="text-[var(--text-sub)]" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={onLoadHistory}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-sub)] hover:text-[var(--text-main)] active:scale-95 transition-all"
        >
          <BsCalendar3 size={13} />
          历史
        </button>

        <button
          onClick={onCarryOver}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-white active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #e86a3a, #d4582c)' }}
        >
          结转下月
          <BsArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

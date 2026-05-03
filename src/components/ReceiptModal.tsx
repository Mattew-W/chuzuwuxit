import { useState, useRef } from 'react'
import { getReceiptHTML } from '../lib/receipt'
import type { Room, CalcResult } from '../types'

interface ReceiptModalProps {
  room: Room
  calc: CalcResult
  year: number
  month: number
  elecPrice: number
  waterPrice: number
  onClose: () => void
}

async function domToBlob(el: HTMLElement): Promise<Blob> {
  const m = await import('dom-to-image-more')
  return m.default.toBlob(el, { quality: 1, width: 680, height: el.scrollHeight, style: { transform: 'none' } })
}

export function ReceiptModal({ room, calc, year, month, elecPrice, waterPrice, onClose }: ReceiptModalProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const saveImage = async () => {
    if (!iframeRef.current) return
    setSaving(true)
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (!doc) { setSaving(false); return }
      const card = doc.querySelector('.card') as HTMLElement
      if (!card) { setSaving(false); return }

      const blob = await domToBlob(card)

      if ('share' in navigator) {
        const file = new File([blob], `结算单_${room.name}_${year}${month}.png`, { type: 'image/png' })
        try {
          await navigator.share({
            title: `${year}年${month}月 ${room.name} 结算单`,
            text: `${room.name} 合计 ¥${calc.total.toFixed(2)}`,
            files: [file],
          })
          setSaved(true)
          setSaving(false)
          return
        } catch { /* fallback */ }
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `结算单_${room.name}_${year}${month}.png`
      a.click()
      URL.revokeObjectURL(url)
      setSaved(true)
    } catch (err) {
      console.error('Save failed:', err)
    }
    setSaving(false)
  }

  const html = getReceiptHTML(room, calc, year, month, elecPrice, waterPrice)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f5f3f0] safe-top">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-xl">×</button>
        <span className="text-sm font-semibold">{room.name} 结算单</span>
        <button
          onClick={saveImage}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white active:scale-95 transition-all disabled:opacity-50"
          style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
        >
          {saved ? '已分享' : saving ? '生成中...' : '分享'}
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <iframe ref={iframeRef} srcDoc={html} style={{ width: '100%', height: '100%', border: 'none' }} title="结算单" />
      </div>
      <div className="px-4 py-2 text-center text-[11px] text-[#888] bg-white">
        长按上方图片可保存至相册，或分享给微信好友
      </div>
    </div>
  )
}

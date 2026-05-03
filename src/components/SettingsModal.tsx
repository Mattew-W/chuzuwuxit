import { useState, useRef } from 'react'
import { BsXLg, BsDownload, BsUpload } from 'react-icons/bs'
import type { AppSettings, Room } from '../types'
import { exportToExcel, exportBackup, importFromExcel, importBackup } from '../lib/excel'

interface SettingsModalProps {
  settings: AppSettings
  rooms: Room[]
  year: number
  month: number
  onUpdateSettings: (s: AppSettings) => void
  onImportRooms: (rooms: Room[], settings?: AppSettings) => void
  onClose: () => void
}

export function SettingsModal({ settings, rooms, year, month, onUpdateSettings, onImportRooms, onClose }: SettingsModalProps) {
  const [local, setLocal] = useState(settings)
  const fileRef = useRef<HTMLInputElement>(null)
  const [importType, setImportType] = useState<'excel' | 'json' | null>(null)

  const handleExportExcel = () => exportToExcel(rooms, year, month, local.elecPrice, local.waterPrice)
  const handleExportBackup = () => exportBackup(rooms, { elecPrice: local.elecPrice, waterPrice: local.waterPrice })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      if (importType === 'excel') {
        const imported = await importFromExcel(file)
        onImportRooms(imported)
      } else {
        const data = await importBackup(file)
        onImportRooms(data.rooms, { ...settings, ...data.settings })
      }
    } catch (err: any) {
      alert('导入失败: ' + err.message)
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[var(--app-bg)] safe-top animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card-bg)]">
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
          <BsXLg size={18} />
        </button>
        <span className="text-sm font-semibold">设置</span>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 space-y-5">
        {/* Prices */}
        <div className="card p-4">
          <div className="text-sm font-semibold mb-3">单价设置</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[var(--text-sub)] mb-1">电价 (元/度)</div>
              <input
                type="number"
                step="0.1"
                value={local.elecPrice}
                onChange={(e) => setLocal({ ...local, elecPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-lg font-semibold focus:outline-none focus:border-[#e86a3a]"
              />
            </div>
            <div>
              <div className="text-xs text-[var(--text-sub)] mb-1">水价 (元/吨)</div>
              <input
                type="number"
                step="0.5"
                value={local.waterPrice}
                onChange={(e) => setLocal({ ...local, waterPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-lg font-semibold focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <div className="text-xs text-[var(--text-sub)] mb-1">默认卫生费</div>
              <input
                type="number"
                value={local.defaultHygiene}
                onChange={(e) => setLocal({ ...local, defaultHygiene: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-[#e86a3a]"
              />
            </div>
            <div>
              <div className="text-xs text-[var(--text-sub)] mb-1">默认网线费</div>
              <input
                type="number"
                value={local.defaultNetwork}
                onChange={(e) => setLocal({ ...local, defaultNetwork: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-[#e86a3a]"
              />
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings(local)}
            className="mt-4 w-full py-2.5 rounded-full text-sm font-semibold text-white active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #e86a3a, #d4582c)' }}
          >
            保存设置
          </button>
        </div>

        {/* Export */}
        <div className="card p-4">
          <div className="text-sm font-semibold mb-3">导出数据</div>
          <div className="space-y-2">
            <button onClick={handleExportExcel} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition-colors">
              <BsDownload size={16} className="text-green-500" />
              导出 Excel 租金单
            </button>
            <button onClick={handleExportBackup} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition-colors">
              <BsDownload size={16} className="text-blue-500" />
              导出 JSON 备份
            </button>
          </div>
        </div>

        {/* Import */}
        <div className="card p-4">
          <div className="text-sm font-semibold mb-3">导入数据</div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.json" onChange={handleFileChange} className="hidden" />
          <div className="space-y-2">
            <button
              onClick={() => { setImportType('excel'); fileRef.current?.click() }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition-colors"
            >
              <BsUpload size={16} className="text-green-500" />
              从 Excel 导入
            </button>
            <button
              onClick={() => { setImportType('json'); fileRef.current?.click() }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition-colors"
            >
              <BsUpload size={16} className="text-blue-500" />
              从 JSON 备份恢复
            </button>
          </div>
        </div>

        <div className="pb-6" />
      </div>
    </div>
  )
}

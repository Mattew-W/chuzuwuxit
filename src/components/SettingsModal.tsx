import { useState, useRef } from 'react'
import type { AppSettings, Room } from '../types'
import { exportToExcel, exportBackup, importFromExcel, importBackup } from '../lib/excel'

interface Props {
  settings: AppSettings
  rooms: Room[]
  year: number
  month: number
  onUpdateSettings: (s: AppSettings) => void
  onImportRooms: (rooms: Room[], settings?: AppSettings) => void
  onClose: () => void
}

export function SettingsModal({ settings, rooms, year, month, onUpdateSettings, onImportRooms, onClose }: Props) {
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
    <div className="fixed inset-0 z-50 bg-[#f5f3f0] safe-top safe-bottom overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#f5f3f0] px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <button onClick={onClose} className="text-2xl text-[#888]">×</button>
        <span className="text-base font-semibold">设置</span>
        <div className="w-6" />
      </div>

      <div className="p-4 space-y-4 max-w-[480px] mx-auto">
        {/* 单价设置 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-sm font-semibold mb-3">单价设置</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[#888] mb-1">电价 (元/度)</div>
              <input
                type="number"
                step="0.1"
                value={local.elecPrice}
                onChange={(e) => setLocal({ ...local, elecPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-lg font-semibold focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <div>
              <div className="text-xs text-[#888] mb-1">水价 (元/吨)</div>
              <input
                type="number"
                step="0.5"
                value={local.waterPrice}
                onChange={(e) => setLocal({ ...local, waterPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-lg font-semibold focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <div>
              <div className="text-xs text-[#888] mb-1">默认卫生费</div>
              <input
                type="number"
                value={local.defaultHygiene}
                onChange={(e) => setLocal({ ...local, defaultHygiene: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <div>
              <div className="text-xs text-[#888] mb-1">默认网线费</div>
              <input
                type="number"
                value={local.defaultNetwork}
                onChange={(e) => setLocal({ ...local, defaultNetwork: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#2563eb]"
              />
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings(local)}
            className="mt-4 w-full py-2.5 rounded-full text-sm font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 transition-all"
          >
            保存设置
          </button>
        </div>

        {/* 导出数据 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-sm font-semibold mb-3">导出数据</div>
          <div className="space-y-2">
            <button onClick={handleExportExcel} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors">
              <span className="text-green-600">↓</span>
              导出 Excel 租金单
            </button>
            <button onClick={handleExportBackup} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors">
              <span className="text-blue-600">↓</span>
              导出 JSON 备份
            </button>
          </div>
        </div>

        {/* 导入数据 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-sm font-semibold mb-3">导入数据</div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.json" onChange={handleFileChange} className="hidden" />
          <div className="space-y-2">
            <button
              onClick={() => { setImportType('excel'); fileRef.current?.click() }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-green-600">↑</span>
              从 Excel 导入
            </button>
            <button
              onClick={() => { setImportType('json'); fileRef.current?.click() }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-blue-600">↑</span>
              从 JSON 备份恢复
            </button>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}

import * as XLSX from 'xlsx'
import type { Room } from '../types'

/* ---- 导出 Excel（模拟原模板格式） ---- */
export function exportToExcel(
  rooms: Room[],
  year: number,
  month: number,
  elecPrice: number,
  waterPrice: number
): void {
  const rows: (string | number)[][] = []

  for (const room of rooms) {
    const elecUsage = Math.max(0, room.elecNow - room.elecLast)
    const elecAmount = +(elecUsage * elecPrice).toFixed(2)
    const waterUsage = Math.max(0, room.waterNow - room.waterLast)
    const waterAmount = +(waterUsage * waterPrice).toFixed(2)
    const total = +(room.rent + elecAmount + waterAmount + room.hygiene + room.network).toFixed(2)

    rows.push([`${year}年${month}月 - 房号 ${room.name} 结算单`])
    rows.push(['房号', '房租', '电费明细', '', '', '', '', '水费明细', '', '', '', '', '卫生', '网线'])
    rows.push(['', '', '本月', '上月', '实用', '单价', '金额', '本月', '上月', '实用', '单价', '金额', '', ''])
    rows.push([
      room.name, room.rent,
      room.elecNow, room.elecLast, elecUsage, elecPrice, elecAmount,
      room.waterNow, room.waterLast, waterUsage, waterPrice, waterAmount,
      room.hygiene, room.network,
    ])
    rows.push(['备注:', room.remarks, '', '', '', '', '合计应收:', '', '', '', '', total])
    rows.push([])
    rows.push([])
  }

  const ws = XLSX.utils.aoa_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '租金单')
  XLSX.writeFile(wb, `${year}年${month}月_租金单.xlsx`)
}

/* ---- 导入 Excel（智能解析） ---- */
export function importFromExcel(file: File): Promise<Room[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1 })
        const rooms: Room[] = []
        let currentName = ''

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]
          if (!row || !row.length) continue

          const firstCell = String(row[0] || '').trim()
          const isHeader = firstCell.includes('结算单')
          const isRoomLine = firstCell && !isHeader && !['房号', '备注:', '合计应收:', ''].includes(firstCell)

          if (isHeader) {
            const match = firstCell.match(/房号\s*(\S+)/)
            if (match) currentName = match[1]
          }

          if (isRoomLine && currentName && typeof row[2] !== 'undefined') {
            const rent = Number(row[2]) || 0
            const elecNow = Number(row[3]) || 0
            const elecLast = Number(row[4]) || 0
            const waterNow = Number(row[8]) || 0
            const waterLast = Number(row[9]) || 0
            const hygiene = Number(row[13]) || 0
            const network = Number(row[14]) || 0

            rooms.push({
              id: currentName,
              name: currentName,
              rent,
              deposit: 0,
              elecNow,
              elecLast,
              waterNow,
              waterLast,
              hygiene,
              network,
              remarks: '',
              status: 'active',
              moveInDate: '',
              tenantNote: '',
            })
            currentName = ''
          }
        }

        resolve(rooms)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsArrayBuffer(file)
  })
}

/* ---- 导出 JSON 备份 ---- */
export function exportBackup(rooms: Room[], settings: { elecPrice: number; waterPrice: number }): void {
  const data = JSON.stringify(
    { rooms, settings, exportedAt: new Date().toISOString(), version: 2 },
    null,
    2
  )
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `出租屋数据备份_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/* ---- 导入 JSON 备份 ---- */
export function importBackup(file: File): Promise<{ rooms: Room[]; settings: { elecPrice: number; waterPrice: number } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target!.result as string)
        resolve({ rooms: data.rooms || [], settings: data.settings || { elecPrice: 1.3, waterPrice: 7 } })
      } catch {
        reject(new Error('JSON 格式错误'))
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file)
  })
}

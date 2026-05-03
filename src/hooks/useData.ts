import { useState, useEffect, useCallback } from 'react'
import type { Room, AppSettings } from '../types'
import { getRooms, bulkSaveRooms, getSettings, saveSettings as dbSaveSettings, getSnapshot, saveSnapshot } from '../lib/db'
import { calcMonthTotal, carryOverRooms, calcAllRooms } from '../lib/calculator'
import { useMemo } from 'react'

export function useData() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [settings, setSettings] = useState<AppSettings>({ elecPrice: 1.3, waterPrice: 7, defaultHygiene: 5, defaultNetwork: 0 })
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings()
        setSettings(s)
        let r = await getRooms()
        setRooms(r)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const totals = calcMonthTotal(rooms, settings.elecPrice, settings.waterPrice)
  const calcRooms = useMemo(() => calcAllRooms(rooms, settings.elecPrice, settings.waterPrice), [rooms, settings.elecPrice, settings.waterPrice])

  const updateRoom = useCallback(async (name: string, field: keyof Room, value: number | string) => {
    setRooms((prev) =>
      prev.map((r) => (r.name === name ? { ...r, [field]: field === 'remarks' || field === 'name' || field === 'moveInDate' || field === 'tenantNote' || field === 'status' ? value : Number(value) || 0 } : r))
    )
  }, [])

  const saveAll = useCallback(async () => {
    await bulkSaveRooms(rooms)
  }, [rooms])

  const addRoom = useCallback(async () => {
    const newRoom: Room = {
      id: `${rooms.length + 201}`,
      name: `${rooms.length + 201}`,
      rent: 0,
      deposit: 0,
      elecNow: 0,
      elecLast: 0,
      waterNow: 0,
      waterLast: 0,
      hygiene: settings.defaultHygiene,
      network: settings.defaultNetwork,
      remarks: '',
      status: 'active',
      moveInDate: '',
      tenantNote: '',
    }
    const updated = [...rooms, newRoom]
    setRooms(updated)
    await bulkSaveRooms(updated)
    showToast('房间已添加')
  }, [rooms, settings])

  const removeRoom = useCallback(async (name: string) => {
    const updated = rooms.filter((r) => r.name !== name)
    setRooms(updated)
    await bulkSaveRooms(updated)
    showToast(`房间 ${name} 已删除`)
  }, [rooms])

  const updateSettings = useCallback(async (newSettings: AppSettings) => {
    setSettings(newSettings)
    await dbSaveSettings(newSettings)
    showToast('设置已保存')
  }, [])

  const carryOver = useCallback(async () => {
    if (!rooms.length) return showToast('没有房间数据')

    // 1. 保存当前月快照
    await saveSnapshot({
      year, month,
      rooms: JSON.parse(JSON.stringify(rooms)),
      elecPrice: settings.elecPrice,
      waterPrice: settings.waterPrice,
      createdAt: new Date().toISOString(),
    })

    // 2. 结转下月
    const nextRooms = carryOverRooms(rooms)
    setRooms(nextRooms)
    await bulkSaveRooms(nextRooms)

    // 3. 月份 +1
    if (month === 12) {
      setYear((y) => y + 1)
      setMonth(1)
    } else {
      setMonth((m) => m + 1)
    }

    showToast('已结转至下月，快照已保存')
  }, [rooms, year, month, settings])

  const loadMonth = useCallback(async (y: number, m: number) => {
    const snap = await getSnapshot(y, m)
    if (snap) {
      setRooms(snap.rooms)
      setSettings({ elecPrice: snap.elecPrice, waterPrice: snap.waterPrice, defaultHygiene: settings.defaultHygiene, defaultNetwork: settings.defaultNetwork })
      setYear(y)
      setMonth(m)
      showToast(`已加载 ${y}年${m}月 数据`)
    } else {
      showToast('该月无快照数据')
    }
  }, [settings])

  const setRoomsDirect = useCallback(async (newRooms: Room[], newSettings?: AppSettings) => {
    setRooms(newRooms)
    await bulkSaveRooms(newRooms)
    if (newSettings) {
      setSettings(newSettings)
      await dbSaveSettings(newSettings)
    }
  }, [])

  const snapYear = useCallback((y: number) => {
    setYear(y)
  }, [])

  const snapMonth = useCallback((m: number) => {
    setMonth(m)
  }, [])

  return {
    rooms, calcRooms, settings, year, month, totals,
    loading, toast,
    updateRoom, saveAll, addRoom, removeRoom,
    updateSettings, carryOver, loadMonth,
    setRoomsDirect,
    snapYear, snapMonth,
  }
}

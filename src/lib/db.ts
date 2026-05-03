import Dexie, { type Table } from 'dexie'
import type { Room, MonthSnapshot, AppSettings } from '../types'

class RentalDB extends Dexie {
  rooms!: Table<Room, string>
  snapshots!: Table<MonthSnapshot, string>
  settings!: Table<AppSettings, string>

  constructor() {
    super('RentalManager')
    this.version(1).stores({
      rooms: 'name',
      snapshots: '[year+month]',
      settings: '',
    })
  }
}

export const db = new RentalDB()

/* ---- 房间操作 ---- */
export async function getRooms(): Promise<Room[]> {
  return db.rooms.toArray()
}

export async function saveRoom(room: Room): Promise<void> {
  await db.rooms.put(room)
}

export async function deleteRoom(name: string): Promise<void> {
  await db.rooms.delete(name)
}

export async function bulkSaveRooms(rooms: Room[]): Promise<void> {
  await db.rooms.bulkPut(rooms)
}

/* ---- 月度快照 ---- */
export async function getSnapshot(year: number, month: number): Promise<MonthSnapshot | undefined> {
  return db.snapshots.where({ year, month }).first()
}

export async function saveSnapshot(snapshot: MonthSnapshot): Promise<void> {
  await db.snapshots.put(snapshot)
}

export async function getAllSnapshots(): Promise<MonthSnapshot[]> {
  return db.snapshots.orderBy('createdAt').reverse().toArray()
}

/* ---- 设置 ---- */
const SETTINGS_KEY = 'current'

export async function getSettings(): Promise<AppSettings> {
  const s = await db.settings.get(SETTINGS_KEY)
  return s || { elecPrice: 1.3, waterPrice: 7, defaultHygiene: 5, defaultNetwork: 0 }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await db.settings.put(settings, SETTINGS_KEY)
}

/* ---- 数据导出导入 ---- */
export async function exportAllData(): Promise<string> {
  const rooms = await db.rooms.toArray()
  const snapshots = await db.snapshots.toArray()
  const settings = await getSettings()
  return JSON.stringify({ rooms, snapshots, settings, exportedAt: new Date().toISOString() }, null, 2)
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json)
  if (data.rooms) await db.rooms.bulkPut(data.rooms)
  if (data.snapshots) await db.snapshots.bulkPut(data.snapshots)
  if (data.settings) await saveSettings(data.settings)
}

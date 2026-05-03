/* ---- 房间数据 ---- */
export interface Room {
  id: string
  name: string
  rent: number
  deposit: number
  elecNow: number
  elecLast: number
  waterNow: number
  waterLast: number
  hygiene: number
  network: number
  remarks: string
  status: 'active' | 'vacant'
  moveInDate: string
  tenantNote: string
}

/* ---- 月度快照 ---- */
export interface MonthSnapshot {
  year: number
  month: number
  rooms: Room[]
  elecPrice: number
  waterPrice: number
  createdAt: string
}

/* ---- 系统设置 ---- */
export interface AppSettings {
  elecPrice: number
  waterPrice: number
  defaultHygiene: number
  defaultNetwork: number
}

/* ---- 汇总统计 ---- */
export interface CalcResult {
  elecUsage: number
  elecAmount: number
  waterUsage: number
  waterAmount: number
  total: number
}

/* ---- 房间 + 计算结果 (合并类型) ---- */
export interface RoomCalc extends Room {
  elecUsage: number
  elecAmount: number
  waterUsage: number
  waterAmount: number
  total: number
}

/* ---- 年份统计 ---- */
export interface YearStat {
  year: number
  months: { month: number; total: number; roomCount: number }[]
}

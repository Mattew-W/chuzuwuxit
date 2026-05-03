import type { Room, CalcResult, RoomCalc } from '../types'

export function calcRoom(room: Room, elecPrice: number, waterPrice: number): CalcResult {
  const elecUsage = Math.max(0, room.elecNow - room.elecLast)
  const waterUsage = Math.max(0, room.waterNow - room.waterLast)
  const elecAmount = +(elecUsage * elecPrice).toFixed(2)
  const waterAmount = +(waterUsage * waterPrice).toFixed(2)
  const total = +(room.rent + elecAmount + waterAmount + room.hygiene + room.network).toFixed(2)
  return { elecUsage, elecAmount, waterUsage, waterAmount, total }
}

/* 批量计算，返回 RoomCalc[] */
export function calcAllRooms(rooms: Room[], elecPrice: number, waterPrice: number): RoomCalc[] {
  return rooms.map((room) => {
    const c = calcRoom(room, elecPrice, waterPrice)
    return { ...room, ...c }
  })
}

export function calcMonthTotal(rooms: Room[], elecPrice: number, waterPrice: number) {
  let totalRent = 0
  let totalElec = 0
  let totalWater = 0
  let grandTotal = 0

  for (const r of rooms) {
    const { elecAmount, waterAmount, total } = calcRoom(r, elecPrice, waterPrice)
    totalRent += r.rent
    totalElec += elecAmount
    totalWater += waterAmount
    grandTotal += total
  }

  return {
    totalRent: +totalRent.toFixed(2),
    totalElec: +totalElec.toFixed(2),
    totalWater: +totalWater.toFixed(2),
    grandTotal: +grandTotal.toFixed(2),
    activeCount: rooms.filter((r) => r.status === 'active').length,
    totalCount: rooms.length,
  }
}

export function carryOverRooms(rooms: Room[]): Room[] {
  return rooms.map((r) => ({
    ...r,
    elecLast: r.elecNow,
    elecNow: r.elecNow,
    waterLast: r.waterNow,
    waterNow: r.waterNow,
    remarks: '',
  }))
}

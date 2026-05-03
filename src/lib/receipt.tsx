import type { Room, CalcResult } from '../types'

export function getReceiptHTML(
  room: Room,
  calc: CalcResult,
  year: number,
  month: number,
  elecPrice: number,
  waterPrice: number
): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=750, initial-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    background: #f5f3f0;
    display: flex; justify-content: center;
    padding: 20px;
  }
  .card {
    width: 680px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    overflow: hidden;
  }
  .head {
    background: linear-gradient(135deg, #e86a3a 0%, #d4582c 100%);
    color: #fff;
    padding: 28px 32px;
    text-align: center;
  }
  .head h1 { font-size: 22px; font-weight: 600; margin-bottom: 4px; }
  .head p { font-size: 14px; opacity: 0.85; }
  .body { padding: 24px 32px 32px; }
  .section-title {
    font-size: 15px; font-weight: 600;
    color: #e86a3a;
    margin: 20px 0 12px;
    padding-left: 10px;
    border-left: 3px solid #e86a3a;
  }
  .section-title:first-child { margin-top: 0; }
  .row {
    display: flex; align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0ece8;
  }
  .row:last-child { border-bottom: none; }
  .label { width: 120px; font-size: 14px; color: #888; }
  .value { flex: 1; font-size: 15px; color: #1a1a1a; text-align: right; }
  .highlight { color: #e86a3a; font-weight: 600; font-size: 16px; }
  .divider {
    height: 1px; background: #e8e4e0;
    margin: 20px 0;
  }
  .total-line {
    display: flex; align-items: center;
    background: #fff8f5;
    border-radius: 10px;
    padding: 16px 20px;
    margin-top: 8px;
  }
  .total-label { font-size: 16px; font-weight: 600; color: #1a1a1a; }
  .total-amount {
    flex: 1; text-align: right;
    font-size: 28px; font-weight: 700;
    color: #e86a3a;
    letter-spacing: -0.5px;
  }
  .footer {
    text-align: center;
    padding: 16px;
    font-size: 12px;
    color: #bbb;
  }
  .badge {
    display: inline-block;
    background: #e86a3a10;
    color: #e86a3a;
    padding: 2px 10px;
    border-radius: 100px;
    font-size: 12px;
    margin-left: 3px;
  }
</style>
</head>
<body>
<div class="card">
  <div class="head">
    <h1>${year}年${month}月 财务费用结算单</h1>
    <p>房号 ${room.name}</p>
  </div>
  <div class="body">
    <div class="section-title">基础费用</div>
    <div class="row">
      <span class="label">房租</span>
      <span class="value">¥${room.rent.toFixed(2)}</span>
    </div>
    <div class="row">
      <span class="label">卫生费</span>
      <span class="value">¥${room.hygiene.toFixed(2)}</span>
    </div>
    <div class="row">
      <span class="label">网线费</span>
      <span class="value">¥${room.network.toFixed(2)}</span>
    </div>

    <div class="section-title">电费明细 <span class="badge">¥${elecPrice}/度</span></div>
    <div class="row">
      <span class="label">本月读数</span>
      <span class="value">${room.elecNow}</span>
    </div>
    <div class="row">
      <span class="label">上月读数</span>
      <span class="value">${room.elecLast}</span>
    </div>
    <div class="row">
      <span class="label">实用度数</span>
      <span class="value highlight">${calc.elecUsage} 度</span>
    </div>
    <div class="row">
      <span class="label">电费金额</span>
      <span class="value highlight">¥${calc.elecAmount.toFixed(2)}</span>
    </div>

    <div class="section-title">水费明细 <span class="badge">¥${waterPrice}/吨</span></div>
    <div class="row">
      <span class="label">本月读数</span>
      <span class="value">${room.waterNow}</span>
    </div>
    <div class="row">
      <span class="label">上月读数</span>
      <span class="value">${room.waterLast}</span>
    </div>
    <div class="row">
      <span class="label">实用吨数</span>
      <span class="value highlight">${calc.waterUsage} 吨</span>
    </div>
    <div class="row">
      <span class="label">水费金额</span>
      <span class="value highlight">¥${calc.waterAmount.toFixed(2)}</span>
    </div>

    ${room.remarks ? `<div class="row"><span class="label">备注</span><span class="value" style="color:#888;font-size:13px">${room.remarks}</span></div>` : ''}

    <div class="divider"></div>

    <div class="total-line">
      <span class="total-label">本月合计应收</span>
      <span class="total-amount">¥${calc.total.toFixed(2)}</span>
    </div>
  </div>
  <div class="footer">${year}年${month}月 收租管理系统 生成</div>
</div>
</body>
</html>`
}

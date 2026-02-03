/**
 * Lunar Calendar Service
 * Using @dqcai/vn-lunar for accurate Vietnamese lunar calendar
 */

import { Injectable } from '@angular/core';
import { LunarCalendar } from '@dqcai/vn-lunar';

export interface LunarDateInfo {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  jd: number; // Julian Day
}

export interface CanChiInfo {
  year: { can: number; chi: number; canTen: string; chiTen: string };
  month: { can: number; chi: number; canTen: string; chiTen: string };
  day: { can: number; chi: number; canTen: string; chiTen: string };
  hour: { can: number; chi: number; canTen: string; chiTen: string };
}

const CAN_NAMES = ['', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI_NAMES = ['', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

@Injectable({
  providedIn: 'root',
})
export class LunarCalendarService {
  /**
   * Convert solar date to Vietnamese lunar date
   */
  solarToLunar(solarDate: Date, timeZone: number = 7): LunarDateInfo {
    const day = solarDate.getDate();
    const month = solarDate.getMonth() + 1;
    const year = solarDate.getFullYear();

    const calendar = LunarCalendar.fromSolar(day, month, year);
    const lunarDate = calendar.lunarDate;

    return {
      day: lunarDate.day,
      month: lunarDate.month,
      year: lunarDate.year,
      isLeapMonth: lunarDate.leap || false,
      jd: lunarDate.jd || this.jdFromDate(day, month, year),
    };
  }


  /**
   * Julian Day from solar date
   */
  jdFromDate(dd: number, mm: number, yy: number): number {
    const a = Math.floor((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd =
      dd +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045;

    if (jd < 2299161) {
      jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    return jd;
  }

  /**
   * Get Can Chi for year/month/day/hour
   * @param lunarDay Ngày âm lịch
   * @param lunarMonth Tháng âm lịch
   * @param lunarYear Năm âm lịch
   * @param hourIndex Giờ sinh (1-12: Tý, Sửu, Dần...)
   * @param solarDate Ngày dương lịch (để tính Can ngày)
   */
  getCanChi(
    lunarDay: number,
    lunarMonth: number,
    lunarYear: number,
    hourIndex: number,
    solarDate: Date
  ): CanChiInfo {
    // Can Chi năm
    const canNam = ((lunarYear + 6) % 10) + 1;
    const chiNam = ((lunarYear + 8) % 12) + 1;

    // Can Chi tháng
    const canThang = ((lunarYear * 12 + lunarMonth + 3) % 10) + 1;
    const chiThang = lunarMonth; // Chi tháng = tháng âm lịch

    // Can Chi ngày (cần dùng Julian Day)
    const jd = this.jdFromDate(solarDate.getDate(), solarDate.getMonth() + 1, solarDate.getFullYear());
    const canNgay = ((jd + 9) % 10) + 1;
    const chiNgay = ((jd + 1) % 12) + 1;

    // Can Chi giờ
    let canGio = (((jd - 1) * 2) % 10 + hourIndex) % 10;
    if (canGio === 0) canGio = 10;
    const chiGio = hourIndex;

    return {
      year: {
        can: canNam,
        chi: chiNam,
        canTen: CAN_NAMES[canNam] || '',
        chiTen: CHI_NAMES[chiNam] || '',
      },
      month: {
        can: canThang,
        chi: chiThang,
        canTen: CAN_NAMES[canThang] || '',
        chiTen: CHI_NAMES[chiThang] || '',
      },
      day: {
        can: canNgay,
        chi: chiNgay,
        canTen: CAN_NAMES[canNgay] || '',
        chiTen: CHI_NAMES[chiNgay] || '',
      },
      hour: {
        can: canGio,
        chi: chiGio,
        canTen: CAN_NAMES[canGio] || '',
        chiTen: CHI_NAMES[chiGio] || '',
      },
    };
  }

  /**
   * Format lunar date to Vietnamese string
   */
  formatLunarDate(lunar: LunarDateInfo): string {
    const leapText = lunar.isLeapMonth ? ' (nhuận)' : '';
    return `Ngày ${lunar.day} tháng ${lunar.month}${leapText} năm ${lunar.year}`;
  }

  /**
   * Get hour index from time range string
   * @param timeRange Format: "HH:00-HH:00"
   * @returns 1-12 (Tý, Sửu, Dần, ...)
   */
  getHourIndex(timeRange: string): number {
    const timeMap: Record<string, number> = {
      '23:00-01:00': 1,
      '01:00-03:00': 2,
      '03:00-05:00': 3,
      '05:00-07:00': 4,
      '07:00-09:00': 5,
      '09:00-11:00': 6,
      '11:00-13:00': 7,
      '13:00-15:00': 8,
      '15:00-17:00': 9,
      '17:00-19:00': 10,
      '19:00-21:00': 11,
      '21:00-23:00': 12,
    };
    return timeMap[timeRange] ?? 1;
  }

  /**
   * Get Chi name from hour index
   */
  getHourChiName(hourIndex: number): string {
    return CHI_NAMES[hourIndex] || '';
  }
}

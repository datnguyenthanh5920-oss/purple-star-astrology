/**
 * TuVi Service - Main facade service
 * This is a bridge between the old interface and new tuvi-core implementation
 * Maintains backward compatibility while using the new Nam Phái logic
 */

import { Injectable } from '@angular/core';
import {
  TuViChartService,
  TuViInput as CoreTuViInput,
  TuViChart as CoreTuViChart,
  CungInfo,
  SaoInCung,
  LunarCalendarService,
} from './tuvi-core';
import { DIA_CHI, NGU_HANH } from './tuvi-core/constants';

// ============================================
// INTERFACES (Backward compatible)
// ============================================

export interface TuViInput {
  fullName: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthTime: string;
}

export interface StarInfo {
  name: string;
  type: 'major' | 'minor' | 'adjective' | 'changsheng' | 'boshi' | 'jiangqian' | 'suiqian';
  brightness?: string;
  brightnessShort?: string;
  mutagen?: string;
  mutagenShort?: string;
}

export interface DecadalInfo {
  range: [number, number];
  heavenlyStem: string;
  earthlyBranch: string;
}

export interface Palace {
  index: number;
  name: string;
  nameVi: string;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: StarInfo[];
  minorStars: StarInfo[];
  adjectiveStars: StarInfo[];
  changsheng12: string;
  boshi12: string;
  jiangqian12: string;
  suiqian12: string;
  decadal: DecadalInfo;
  ages: number[];
  isBodyPalace: boolean;
  isOriginalPalace: boolean;
  isTuan?: boolean;
  isTriet?: boolean;
}

export interface HoroscopePosition {
  name: string;
  index: number;
  heavenlyStem: string;
  earthlyBranch: string;
  mutagen: string[];
}

export interface TuViChart {
  fullName: string;
  gender: string;
  solarDate: string;
  lunarDate: string;
  chineseDate: string;
  time: string;
  timeRange: string;
  zodiacSign: string;
  sign: string;
  heavenlyStemOfSoul: string;
  earthlyBranchOfSoul: string;
  earthlyBranchOfBody: string;
  fiveElement: string;
  soulStar: string;
  bodyStar: string;
  palaces: Palace[];
  horoscope?: {
    decadal: HoroscopePosition;
    age: HoroscopePosition & { nominalAge: number };
    yearly: HoroscopePosition;
    monthly: HoroscopePosition;
    daily: HoroscopePosition;
  };
  tuanTriet?: {
    tuan: string[];
    triet: string[];
  };
  // Additional info from new implementation
  thienBan?: {
    cuc: string;
    banMenh: string;
    menhChu: string;
    thanChu: string;
    amDuongNamSinh: string;
    amDuongMenh: string;
    sinhKhac: string;
  };
  rawChart: CoreTuViChart;
}

// ============================================
// BRIGHTNESS MAPPING
// ============================================

const BRIGHTNESS_FULL: Record<string, string> = {
  M: 'Miếu',
  V: 'Vượng',
  Đ: 'Đắc',
  B: 'Bình',
  H: 'Hãm',
};

const MUTAGEN_MAP: Record<string, { full: string; short: string }> = {
  Lộc: { full: 'Lộc', short: '祿' },
  Quyền: { full: 'Quyền', short: '權' },
  Khoa: { full: 'Khoa', short: '科' },
  Kỵ: { full: 'Kỵ', short: '忌' },
};

// ============================================
// SERVICE
// ============================================

@Injectable({
  providedIn: 'root',
})
export class TuViService {
  constructor(
    private chartService: TuViChartService,
    private lunarService: LunarCalendarService
  ) {}

  /**
   * Generate chart using new Nam Phái implementation
   */
  generateChart(input: TuViInput): TuViChart {
    // Generate using new core service
    const coreChart = this.chartService.generateChart(input);

    // Convert to backward-compatible format
    return this.convertToLegacyFormat(input, coreChart);
  }

  /**
   * Convert new chart format to legacy format for backward compatibility
   */
  private convertToLegacyFormat(input: TuViInput, chart: CoreTuViChart): TuViChart {
    const { thienBan, cung, rawData } = chart;

    // Find cung Mệnh and cung Thân
    const cungMenh = cung.find(c => c.isCungMenh);
    const cungThan = cung.find(c => c.isCungThan);

    // Get Tuần Triệt positions
    const tuanCungs = cung.filter(c => c.isTuan).map(c => c.diaChi);
    const trietCungs = cung.filter(c => c.isTriet).map(c => c.diaChi);

    // Convert palaces
    const palaces = this.convertPalaces(cung);

    return {
      fullName: thienBan.ten,
      gender: thienBan.gioiTinh,
      solarDate: thienBan.ngayDuong,
      lunarDate: thienBan.ngayAm,
      chineseDate: `${thienBan.canChiNam}年`,
      time: thienBan.gioSinh,
      timeRange: input.birthTime,
      zodiacSign: this.getZodiacSign(rawData.chiNam),
      sign: DIA_CHI[rawData.chiNam]?.tenChi || '',
      heavenlyStemOfSoul: cungMenh?.diaChi || '',
      earthlyBranchOfSoul: cungMenh?.diaChi || '',
      earthlyBranchOfBody: cungThan?.diaChi || '',
      fiveElement: thienBan.cuc,
      soulStar: thienBan.menhChu,
      bodyStar: thienBan.thanChu,
      palaces,
      tuanTriet: {
        tuan: tuanCungs,
        triet: trietCungs,
      },
      thienBan: {
        cuc: thienBan.cuc,
        banMenh: thienBan.banMenh,
        menhChu: thienBan.menhChu,
        thanChu: thienBan.thanChu,
        amDuongNamSinh: thienBan.amDuongNamSinh,
        amDuongMenh: thienBan.amDuongMenh,
        sinhKhac: thienBan.sinhKhac,
      },
      rawChart: chart,
    };
  }

  private convertPalaces(cungList: CungInfo[]): Palace[] {
    return cungList.map((cung, index) => {
      // Separate stars by type
      const majorStars: StarInfo[] = [];
      const minorStars: StarInfo[] = [];
      const adjectiveStars: StarInfo[] = [];
      let changsheng12 = '';
      let boshi12 = '';

      for (const sao of cung.sao) {
        const starInfo = this.convertStar(sao);

        if (sao.saoLoai === 1) {
          // Chính tinh (saoLoai = 1)
          majorStars.push(starInfo);
        } else if (sao.vongTrangSinh) {
          // Vòng Tràng sinh - only set changsheng12 name, don't add to stars
          changsheng12 = sao.saoTen;
        } else if (sao.saoLoai >= 11) {
          // Sát tinh, hung tinh
          adjectiveStars.push(starInfo);
        } else {
          // All other minor stars including Lộc tồn/Bác sỹ group
          minorStars.push(starInfo);
        }
      }

      return {
        index,
        name: cung.tenCung,
        nameVi: cung.tenCung,
        heavenlyStem: cung.thienCan,
        earthlyBranch: cung.diaChi,
        majorStars,
        minorStars,
        adjectiveStars,
        changsheng12,
        boshi12,
        jiangqian12: '',
        suiqian12: '',
        decadal: {
          range: [cung.daiHan, cung.daiHan + 9],
          heavenlyStem: '',
          earthlyBranch: cung.diaChi,
        },
        ages: [],
        isBodyPalace: cung.isCungThan,
        isOriginalPalace: cung.isCungMenh,
        isTuan: cung.isTuan,
        isTriet: cung.isTriet,
      };
    });
  }

  private convertStar(sao: SaoInCung): StarInfo {
    const brightness = sao.saoDacTinh ? BRIGHTNESS_FULL[sao.saoDacTinh] : undefined;
    const mutagen = sao.tuHoa ? MUTAGEN_MAP[sao.tuHoa] : undefined;

    return {
      name: sao.saoTen,
      type: sao.saoLoai === 1 ? 'major' : 'minor',
      brightness,
      brightnessShort: sao.saoDacTinh,
      mutagen: mutagen?.full,
      mutagenShort: mutagen?.short,
    };
  }

  private getZodiacSign(chiNam: number): string {
    const zodiacMap: Record<number, string> = {
      1: 'Tý (Chuột)',
      2: 'Sửu (Trâu)',
      3: 'Dần (Hổ)',
      4: 'Mão (Mèo)',
      5: 'Thìn (Rồng)',
      6: 'Tỵ (Rắn)',
      7: 'Ngọ (Ngựa)',
      8: 'Mùi (Dê)',
      9: 'Thân (Khỉ)',
      10: 'Dậu (Gà)',
      11: 'Tuất (Chó)',
      12: 'Hợi (Lợn)',
    };
    return zodiacMap[chiNam] || '';
  }

  /**
   * Helper: Get hour index from time range
   */
  getHourIndex(birthTime: string): number {
    return this.lunarService.getHourIndex(birthTime);
  }
}

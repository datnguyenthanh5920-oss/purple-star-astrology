/**
 * Tử Vi Chart Builder Service
 * Complete rewrite based on lasotuvi Python implementation
 * Following Nam Phái tradition (Tử Vi Đẩu Số Tân Biên)
 */

import { Injectable } from '@angular/core';
import { LunarCalendarService, LunarDateInfo, CanChiInfo } from './lunar-calendar.service';
import { THIEN_CAN, DIA_CHI, NGU_HANH, TEN_CUNG, HANH_CUNG } from './constants';
import {
  dichCung,
  nguHanhNapAm,
  sinhKhac,
  timCuc,
  timTuVi,
  timTrangSinh,
  timHoaLinh,
  timThienKhoi,
  timThienQuanThienPhuc,
  timCoThan,
  timThienMa,
  timPhaToai,
  timTriet,
  timLuuTru,
  getTuHoaSaoId,
  khoangCachCung,
} from './calculations';
import { StarInfo, DAC_TINH_SAO } from './stars';
import * as Stars from './stars';

// ============================================
// INTERFACES
// ============================================

export interface TuViInput {
  fullName: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthTime: string; // "HH:00-HH:00" format
}

export interface CungInfo {
  cungSo: number;         // 1-12 (Tý, Sửu, Dần,...)
  tenCung: string;        // Mệnh, Phụ Mẫu, Phúc Đức,...
  diaChi: string;         // Tý, Sửu, Dần,...
  hanhCung: string;       // Thủy, Thổ, Mộc,...
  thienCan: string;       // Can của cung
  sao: SaoInCung[];       // Các sao trong cung
  daiHan: number;         // Đại hạn
  tieuHan: string;        // Tiểu hạn
  isCungMenh: boolean;
  isCungThan: boolean;
  isTuan: boolean;
  isTriet: boolean;
}

export interface SaoInCung {
  saoID: number;
  saoTen: string;
  saoNguHanh: string;
  saoLoai: number;
  saoDacTinh?: string;    // M V Đ B H
  tuHoa?: 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ';
  vongTrangSinh?: boolean;
}

export interface ThienBanInfo {
  ten: string;
  gioiTinh: string;
  ngayDuong: string;
  ngayAm: string;
  gioSinh: string;
  canChiNam: string;
  canChiThang: string;
  canChiNgay: string;
  canChiGio: string;
  cuc: string;
  banMenh: string;
  menhChu: string;
  thanChu: string;
  amDuongNamSinh: string;
  amDuongMenh: string;
  sinhKhac: string;
}

export interface TuViChart {
  thienBan: ThienBanInfo;
  cung: CungInfo[];
  rawData: {
    canNam: number;
    chiNam: number;
    lunarDate: LunarDateInfo;
    canChi: CanChiInfo;
  };
}

// ============================================
// SERVICE
// ============================================

@Injectable({
  providedIn: 'root',
})
export class TuViChartService {
  constructor(private lunarService: LunarCalendarService) {}

  /**
   * Generate complete Tử Vi chart
   */
  generateChart(input: TuViInput): TuViChart {
    const gioiTinh = input.gender === 'male' ? 1 : -1;
    const gioSinh = this.lunarService.getHourIndex(input.birthTime);

    // 1. Chuyển đổi lịch âm
    const lunarDate = this.lunarService.solarToLunar(input.birthDate);
    const canChi = this.lunarService.getCanChi(
      lunarDate.day,
      lunarDate.month,
      lunarDate.year,
      gioSinh,
      input.birthDate
    );

    const canNam = canChi.year.can;
    const chiNam = canChi.year.chi;
    const amDuongNamSinh = THIEN_CAN[canNam]?.amDuong ?? 1;
    const amDuongChiNamSinh = DIA_CHI[chiNam]?.amDuong ?? 1;

    // 2. Tính cung Mệnh, cung Thân
    const cungMenh = dichCung(3, lunarDate.month - 1, -(gioSinh) + 1);
    const cungThan = dichCung(3, lunarDate.month - 1, gioSinh - 1);

    // 3. Tìm Cục
    const hanhCuc = timCuc(cungMenh, canNam);
    const cucInfo = NGU_HANH[hanhCuc];
    const cucSo = cucInfo?.cuc ?? 5;

    // 4. Khởi tạo 12 cung
    const diaChart = this.initDiaBan(lunarDate.month, gioSinh, cungMenh, cungThan);

    // 5. Nhập đại hạn
    this.nhapDaiHan(diaChart, cucSo, gioiTinh * amDuongChiNamSinh, cungMenh);

    // 6. Nhập tiểu hạn
    const khoiHan = dichCung(11, -3 * (chiNam - 1));
    this.nhapTieuHan(diaChart, khoiHan, gioiTinh, chiNam);

    // 7. An sao
    this.anSao(diaChart, {
      lunarDate,
      canNam,
      chiNam,
      gioSinh,
      gioiTinh,
      amDuongNamSinh,
      cucSo,
      cungMenh,
      cungThan,
    });

    // 8. An Tuần Triệt
    this.anTuanTriet(diaChart, canNam, chiNam);

    // 9. Tạo Thiên Bàn info
    const thienBan = this.createThienBan(
      input,
      lunarDate,
      canChi,
      cucInfo,
      canNam,
      chiNam,
      cungMenh,
      amDuongNamSinh,
      gioiTinh
    );

    return {
      thienBan,
      cung: diaChart,
      rawData: {
        canNam,
        chiNam,
        lunarDate,
        canChi,
      },
    };
  }

  // ============================================
  // KHỞI TẠO ĐỊA BÀN
  // ============================================

  private initDiaBan(
    thangAm: number,
    gioSinh: number,
    cungMenh: number,
    cungThan: number
  ): CungInfo[] {
    const cungChuMap = this.getCungChuMap(cungMenh);
    const diaChart: CungInfo[] = [];

    for (let i = 1; i <= 12; i++) {
      diaChart.push({
        cungSo: i,
        tenCung: cungChuMap[i] || '',
        diaChi: DIA_CHI[i]?.tenChi || '',
        hanhCung: HANH_CUNG[i] || '',
        thienCan: '',
        sao: [],
        daiHan: 0,
        tieuHan: '',
        isCungMenh: i === cungMenh,
        isCungThan: i === cungThan,
        isTuan: false,
        isTriet: false,
      });
    }

    return diaChart;
  }

  private getCungChuMap(cungMenh: number): Record<number, string> {
    const cungNames = [
      'Mệnh', 'Phụ mẫu', 'Phúc đức', 'Điền trạch', 'Quan lộc', 'Nô bộc',
      'Thiên di', 'Tật ách', 'Tài bạch', 'Tử tức', 'Phu thê', 'Huynh đệ'
    ];
    const map: Record<number, string> = {};
    for (let i = 0; i < 12; i++) {
      map[dichCung(cungMenh, i)] = cungNames[i];
    }
    return map;
  }

  // ============================================
  // NHẬP ĐẠI HẠN & TIỂU HẠN
  // ============================================

  private nhapDaiHan(
    diaChart: CungInfo[],
    cucSo: number,
    chieuDi: number,
    cungMenh: number
  ): void {
    for (const cung of diaChart) {
      const khoangCach = khoangCachCung(cung.cungSo, cungMenh, chieuDi);
      cung.daiHan = cucSo + khoangCach * 10;
    }
  }

  private nhapTieuHan(
    diaChart: CungInfo[],
    khoiTieuHan: number,
    gioiTinh: number,
    chiNam: number
  ): void {
    const viTriCungTy1 = dichCung(khoiTieuHan, -gioiTinh * (chiNam - 1));
    for (const cung of diaChart) {
      const khoangCach = khoangCachCung(cung.cungSo, viTriCungTy1, gioiTinh);
      cung.tieuHan = DIA_CHI[khoangCach + 1]?.tenChi || '';
    }
  }

  // ============================================
  // AN SAO
  // ============================================

  private anSao(
    diaChart: CungInfo[],
    params: {
      lunarDate: LunarDateInfo;
      canNam: number;
      chiNam: number;
      gioSinh: number;
      gioiTinh: number;
      amDuongNamSinh: number;
      cucSo: number;
      cungMenh: number;
      cungThan: number;
    }
  ): void {
    const {
      lunarDate,
      canNam,
      chiNam,
      gioSinh,
      gioiTinh,
      amDuongNamSinh,
      cucSo,
      cungMenh,
      cungThan,
    } = params;

    const nn = lunarDate.day;
    const tt = lunarDate.month;
    const amDuongNamNu = gioiTinh * amDuongNamSinh;

    // Cung Nô Bộc và Tật Ách (để an Thiên Thương, Thiên Sứ)
    const cungNoBoc = dichCung(cungMenh, 5);
    const cungTatAch = dichCung(cungMenh, 7);

    // ==================== TỬ VI TINH HỆ ====================
    const viTriTuVi = timTuVi(cucSo, nn);
    this.addStar(diaChart, viTriTuVi, Stars.SAO_TU_VI);

    const viTriLiemTrinh = dichCung(viTriTuVi, 4);
    this.addStar(diaChart, viTriLiemTrinh, Stars.SAO_LIEM_TRINH);

    const viTriThienDong = dichCung(viTriTuVi, 7);
    this.addStar(diaChart, viTriThienDong, Stars.SAO_THIEN_DONG);

    const viTriVuKhuc = dichCung(viTriTuVi, 8);
    this.addStar(diaChart, viTriVuKhuc, Stars.SAO_VU_KHUC);

    const viTriThaiDuong = dichCung(viTriTuVi, 9);
    this.addStar(diaChart, viTriThaiDuong, Stars.SAO_THAI_DUONG);

    const viTriThienCo = dichCung(viTriTuVi, 11);
    this.addStar(diaChart, viTriThienCo, Stars.SAO_THIEN_CO);

    // ==================== THIÊN PHỦ TINH HỆ ====================
    const viTriThienPhu = dichCung(3, 3 - viTriTuVi);
    this.addStar(diaChart, viTriThienPhu, Stars.SAO_THIEN_PHU);

    const viTriThaiAm = dichCung(viTriThienPhu, 1);
    this.addStar(diaChart, viTriThaiAm, Stars.SAO_THAI_AM);

    const viTriThamLang = dichCung(viTriThienPhu, 2);
    this.addStar(diaChart, viTriThamLang, Stars.SAO_THAM_LANG);

    const viTriCuMon = dichCung(viTriThienPhu, 3);
    this.addStar(diaChart, viTriCuMon, Stars.SAO_CU_MON);

    const viTriThienTuong = dichCung(viTriThienPhu, 4);
    this.addStar(diaChart, viTriThienTuong, Stars.SAO_THIEN_TUONG);

    const viTriThienLuong = dichCung(viTriThienPhu, 5);
    this.addStar(diaChart, viTriThienLuong, Stars.SAO_THIEN_LUONG);

    const viTriThatSat = dichCung(viTriThienPhu, 6);
    this.addStar(diaChart, viTriThatSat, Stars.SAO_THAT_SAT);

    const viTriPhaQuan = dichCung(viTriThienPhu, 10);
    this.addStar(diaChart, viTriPhaQuan, Stars.SAO_PHA_QUAN);

    // ==================== VÒNG LỘC TỒN ====================
    const viTriLocTon = THIEN_CAN[canNam]?.vitriDiaBan ?? 3;
    this.addStar(diaChart, viTriLocTon, Stars.SAO_LOC_TON);
    this.addStar(diaChart, viTriLocTon, Stars.SAO_BAC_SY);

    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 1), Stars.SAO_LUC_SI);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 2), Stars.SAO_THANH_LONG);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 3), Stars.SAO_TIEU_HAO);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 4), Stars.SAO_TUONG_QUAN);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 5), Stars.SAO_TAU_THU);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 6), Stars.SAO_PHI_LIEM);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 7), Stars.SAO_HY_THAN);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 8), Stars.SAO_BENH_PHU);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 9), Stars.SAO_DAI_HAO);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 10), Stars.SAO_PHUC_BINH);
    this.addStar(diaChart, dichCung(viTriLocTon, amDuongNamNu * 11), Stars.SAO_QUAN_PHU_2);

    // ==================== VÒNG THÁI TUẾ ====================
    this.addStar(diaChart, chiNam, Stars.SAO_THAI_TUE);
    this.addStar(diaChart, dichCung(chiNam, 1), Stars.SAO_THIEU_DUONG);
    this.addStar(diaChart, dichCung(chiNam, 1), Stars.SAO_THIEN_KHONG);
    this.addStar(diaChart, dichCung(chiNam, 2), Stars.SAO_TANG_MON);
    this.addStar(diaChart, dichCung(chiNam, 3), Stars.SAO_THIEU_AM);
    this.addStar(diaChart, dichCung(chiNam, 4), Stars.SAO_QUAN_PHU_3);
    this.addStar(diaChart, dichCung(chiNam, 5), Stars.SAO_TU_PHU);
    this.addStar(diaChart, dichCung(chiNam, 5), Stars.SAO_NGUYET_DUC);
    this.addStar(diaChart, dichCung(chiNam, 6), Stars.SAO_TUE_PHA);
    this.addStar(diaChart, dichCung(chiNam, 7), Stars.SAO_LONG_DUC);
    this.addStar(diaChart, dichCung(chiNam, 8), Stars.SAO_BACH_HO);
    this.addStar(diaChart, dichCung(chiNam, 9), Stars.SAO_PHUC_DUC);
    this.addStar(diaChart, dichCung(chiNam, 9), Stars.SAO_THIEN_DUC);
    this.addStar(diaChart, dichCung(chiNam, 10), Stars.SAO_DIEU_KHACH);
    this.addStar(diaChart, dichCung(chiNam, 11), Stars.SAO_TRUC_PHU);

    // ==================== VÒNG TRÀNG SINH ====================
    const viTriTrangSinh = timTrangSinh(cucSo);
    this.addStar(diaChart, viTriTrangSinh, Stars.SAO_TRANG_SINH);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * 1), Stars.SAO_MOC_DUC);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * 2), Stars.SAO_QUAN_DOI);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * 3), Stars.SAO_LAM_QUAN);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * 4), Stars.SAO_DE_VUONG);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * 5), Stars.SAO_SUY);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * 6), Stars.SAO_BENH);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * 7), Stars.SAO_TU);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * 8), Stars.SAO_MO);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * 9), Stars.SAO_TUYET);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * -1), Stars.SAO_THAI);
    this.addStar(diaChart, dichCung(viTriTrangSinh, amDuongNamNu * -2), Stars.SAO_DUONG);

    // ==================== KÌNH DƯƠNG - ĐÀ LA ====================
    this.addStar(diaChart, dichCung(viTriLocTon, -1), Stars.SAO_DA_LA);
    this.addStar(diaChart, dichCung(viTriLocTon, 1), Stars.SAO_KINH_DUONG);

    // ==================== ĐỊA KHÔNG - ĐỊA KIẾP ====================
    const viTriDiaKiep = dichCung(11, gioSinh);
    this.addStar(diaChart, viTriDiaKiep, Stars.SAO_DIA_KIEP);
    this.addStar(diaChart, dichCung(12, 12 - viTriDiaKiep), Stars.SAO_DIA_KHONG);

    // ==================== HỎA TINH - LINH TINH ====================
    const [viTriHoaTinh, viTriLinhTinh] = timHoaLinh(chiNam, gioSinh, gioiTinh, amDuongNamSinh);
    this.addStar(diaChart, viTriHoaTinh, Stars.SAO_HOA_TINH);
    this.addStar(diaChart, viTriLinhTinh, Stars.SAO_LINH_TINH);

    // ==================== TẢ PHÙ - HỮU BẬT ====================
    const viTriTaPhu = dichCung(5, tt - 1);
    this.addStar(diaChart, viTriTaPhu, Stars.SAO_TA_PHU);
    this.addStar(diaChart, dichCung(2, 2 - viTriTaPhu), Stars.SAO_HUU_BAT);

    // ==================== VĂN XƯƠNG - VĂN KHÚC ====================
    const viTriVanKhuc = dichCung(5, gioSinh - 1);
    this.addStar(diaChart, viTriVanKhuc, Stars.SAO_VAN_KHUC);
    const viTriVanXuong = dichCung(2, 2 - viTriVanKhuc);
    this.addStar(diaChart, viTriVanXuong, Stars.SAO_VAN_XUONG);

    // ==================== LONG TRÌ - PHƯỢNG CÁC ====================
    const viTriLongTri = dichCung(5, chiNam - 1);
    this.addStar(diaChart, viTriLongTri, Stars.SAO_LONG_TRI);
    this.addStar(diaChart, dichCung(2, 2 - viTriLongTri), Stars.SAO_PHUONG_CAC);
    this.addStar(diaChart, dichCung(2, 2 - viTriLongTri), Stars.SAO_GIAI_THAN);

    // ==================== TAM THAI - BÁT TỌA ====================
    const viTriTamThai = dichCung(5, tt + nn - 2);
    this.addStar(diaChart, viTriTamThai, Stars.SAO_TAM_THAI);
    this.addStar(diaChart, dichCung(2, 2 - viTriTamThai), Stars.SAO_BAT_TOA);

    // ==================== ÂN QUANG - THIÊN QUÝ ====================
    const viTriAnQuang = dichCung(viTriVanXuong, nn - 2);
    this.addStar(diaChart, viTriAnQuang, Stars.SAO_AN_QUANG);
    this.addStar(diaChart, dichCung(2, 2 - viTriAnQuang), Stars.SAO_THIEN_QUY);

    // ==================== THIÊN KHÔI - THIÊN VIỆT ====================
    const viTriThienKhoi = timThienKhoi(canNam);
    this.addStar(diaChart, viTriThienKhoi, Stars.SAO_THIEN_KHOI);
    this.addStar(diaChart, dichCung(5, 5 - viTriThienKhoi), Stars.SAO_THIEN_VIET);

    // ==================== THIÊN HƯ - THIÊN KHỐC ====================
    this.addStar(diaChart, dichCung(7, chiNam - 1), Stars.SAO_THIEN_HU);
    this.addStar(diaChart, dichCung(7, -chiNam + 1), Stars.SAO_THIEN_KHOC);

    // ==================== THIÊN TÀI - THIÊN THỌ ====================
    this.addStar(diaChart, dichCung(cungMenh, chiNam - 1), Stars.SAO_THIEN_TAI);
    this.addStar(diaChart, dichCung(cungThan, chiNam - 1), Stars.SAO_THIEN_THO);

    // ==================== HỒNG LOAN - THIÊN HỶ ====================
    const viTriHongLoan = dichCung(4, -chiNam + 1);
    this.addStar(diaChart, viTriHongLoan, Stars.SAO_HONG_LOAN);
    this.addStar(diaChart, dichCung(viTriHongLoan, 6), Stars.SAO_THIEN_HY);

    // ==================== THIÊN QUAN - THIÊN PHÚC ====================
    const [viTriThienQuan, viTriThienPhuc] = timThienQuanThienPhuc(canNam);
    this.addStar(diaChart, viTriThienQuan, Stars.SAO_THIEN_QUAN);
    this.addStar(diaChart, viTriThienPhuc, Stars.SAO_THIEN_PHUC);

    // ==================== THIÊN HÌNH - THIÊN RIÊU - THIÊN Y ====================
    const viTriThienHinh = dichCung(10, tt - 1);
    this.addStar(diaChart, viTriThienHinh, Stars.SAO_THIEN_HINH);
    const viTriThienRieu = dichCung(viTriThienHinh, 4);
    this.addStar(diaChart, viTriThienRieu, Stars.SAO_THIEN_RIEU);
    this.addStar(diaChart, viTriThienRieu, Stars.SAO_THIEN_Y);

    // ==================== CÔ THẦN - QUẢ TÚ ====================
    const viTriCoThan = timCoThan(chiNam);
    this.addStar(diaChart, viTriCoThan, Stars.SAO_CO_THAN);
    this.addStar(diaChart, dichCung(viTriCoThan, -4), Stars.SAO_QUA_TU);

    // ==================== VĂN TINH - ĐƯỜNG PHÙ - QUỐC ẤN ====================
    const viTriKinhDuong = dichCung(viTriLocTon, 1);
    const viTriVanTinh = dichCung(viTriKinhDuong, 2);
    this.addStar(diaChart, viTriVanTinh, Stars.SAO_VAN_TINH);
    const viTriDuongPhu = dichCung(viTriVanTinh, 2);
    this.addStar(diaChart, viTriDuongPhu, Stars.SAO_DUONG_PHU);
    this.addStar(diaChart, dichCung(viTriDuongPhu, 3), Stars.SAO_QUOC_AN);

    // ==================== THAI PHỤ - PHONG CÁO ====================
    this.addStar(diaChart, dichCung(viTriVanKhuc, 2), Stars.SAO_THAI_PHU);
    this.addStar(diaChart, dichCung(viTriVanKhuc, -2), Stars.SAO_PHONG_CAO);

    // ==================== THIÊN GIẢI - ĐỊA GIẢI ====================
    this.addStar(diaChart, dichCung(9, (2 * tt) - 2), Stars.SAO_THIEN_GIAI);
    this.addStar(diaChart, dichCung(viTriTaPhu, 3), Stars.SAO_DIA_GIAI);

    // ==================== THIÊN LA - ĐỊA VÕNG ====================
    this.addStar(diaChart, 5, Stars.SAO_THIEN_LA);
    this.addStar(diaChart, 11, Stars.SAO_DIA_VONG);

    // ==================== THIÊN THƯƠNG - THIÊN SỨ ====================
    this.addStar(diaChart, cungNoBoc, Stars.SAO_THIEN_THUONG);
    this.addStar(diaChart, cungTatAch, Stars.SAO_THIEN_SU);

    // ==================== THIÊN MÃ - HOA CÁI - KIẾP SÁT - ĐÀO HOA ====================
    const viTriThienMa = timThienMa(chiNam);
    this.addStar(diaChart, viTriThienMa, Stars.SAO_THIEN_MA);
    this.addStar(diaChart, dichCung(viTriThienMa, 2), Stars.SAO_HOA_CAI);
    const viTriKiepSat = dichCung(viTriThienMa, 3);
    this.addStar(diaChart, viTriKiepSat, Stars.SAO_KIEP_SAT);
    this.addStar(diaChart, dichCung(viTriKiepSat, 4), Stars.SAO_DAO_HOA);

    // ==================== PHÁ TOÁI ====================
    this.addStar(diaChart, timPhaToai(chiNam), Stars.SAO_PHA_TOAI);

    // ==================== ĐẨU QUÂN ====================
    this.addStar(diaChart, dichCung(chiNam, -tt + gioSinh), Stars.SAO_DAU_QUAN);

    // ==================== LƯU HÀ - THIÊN TRÙ ====================
    const [viTriLuuHa, viTriThienTru] = timLuuTru(canNam);
    this.addStar(diaChart, viTriLuuHa, Stars.SAO_LUU_HA);
    this.addStar(diaChart, viTriThienTru, Stars.SAO_THIEN_TRU);

    // ==================== TỨ HÓA ====================
    this.anTuHoa(diaChart, canNam, {
      viTriTuVi,
      viTriLiemTrinh,
      viTriThienDong,
      viTriVuKhuc,
      viTriThaiDuong,
      viTriThienCo,
      viTriThienPhu,
      viTriThaiAm,
      viTriThamLang,
      viTriCuMon,
      viTriThienTuong,
      viTriThienLuong,
      viTriThatSat,
      viTriPhaQuan,
      viTriVanXuong,
      viTriVanKhuc,
      viTriHuuBat: dichCung(2, 2 - viTriTaPhu),
    });
  }

  // ============================================
  // AN TỨ HÓA
  // ============================================

  private anTuHoa(
    diaChart: CungInfo[],
    canNam: number,
    positions: Record<string, number>
  ): void {
    const tuHoa = getTuHoaSaoId(canNam);

    // Map saoID to position variable name
    const saoIdToPos: Record<number, string> = {
      1: 'viTriTuVi',
      2: 'viTriLiemTrinh',
      3: 'viTriThienDong',
      4: 'viTriVuKhuc',
      5: 'viTriThaiDuong',
      6: 'viTriThienCo',
      7: 'viTriThienPhu',
      8: 'viTriThaiAm',
      9: 'viTriThamLang',
      10: 'viTriCuMon',
      11: 'viTriThienTuong',
      12: 'viTriThienLuong',
      13: 'viTriThatSat',
      14: 'viTriPhaQuan',
      57: 'viTriVanXuong',
      58: 'viTriVanKhuc',
      62: 'viTriHuuBat',
    };

    const addTuHoa = (saoId: number, hoaType: 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ') => {
      const posKey = saoIdToPos[saoId];
      if (posKey && positions[posKey]) {
        const cung = diaChart.find(c => c.cungSo === positions[posKey]);
        if (cung) {
          const sao = cung.sao.find(s => s.saoID === saoId);
          if (sao) {
            sao.tuHoa = hoaType;
          }
        }
      }
    };

    addTuHoa(tuHoa.loc, 'Lộc');
    addTuHoa(tuHoa.quyen, 'Quyền');
    addTuHoa(tuHoa.khoa, 'Khoa');
    addTuHoa(tuHoa.ky, 'Kỵ');

    // Also add Hóa sao as separate stars
    const viTriLoc = positions[saoIdToPos[tuHoa.loc] ?? ''] ?? 0;
    const viTriQuyen = positions[saoIdToPos[tuHoa.quyen] ?? ''] ?? 0;
    const viTriKhoa = positions[saoIdToPos[tuHoa.khoa] ?? ''] ?? 0;
    const viTriKy = positions[saoIdToPos[tuHoa.ky] ?? ''] ?? 0;

    if (viTriLoc) this.addStar(diaChart, viTriLoc, Stars.SAO_HOA_LOC);
    if (viTriQuyen) this.addStar(diaChart, viTriQuyen, Stars.SAO_HOA_QUYEN);
    if (viTriKhoa) this.addStar(diaChart, viTriKhoa, Stars.SAO_HOA_KHOA);
    if (viTriKy) this.addStar(diaChart, viTriKy, Stars.SAO_HOA_KY);
  }

  // ============================================
  // AN TUẦN TRIỆT
  // ============================================

  private anTuanTriet(diaChart: CungInfo[], canNam: number, chiNam: number): void {
    // An Tuần
    const ketThucTuan = dichCung(chiNam, 10 - canNam);
    const viTriTuan1 = dichCung(ketThucTuan, 1);
    const viTriTuan2 = dichCung(viTriTuan1, 1);

    const cungTuan1 = diaChart.find(c => c.cungSo === viTriTuan1);
    const cungTuan2 = diaChart.find(c => c.cungSo === viTriTuan2);
    if (cungTuan1) cungTuan1.isTuan = true;
    if (cungTuan2) cungTuan2.isTuan = true;

    // An Triệt
    const [viTriTriet1, viTriTriet2] = timTriet(canNam);
    const cungTriet1 = diaChart.find(c => c.cungSo === viTriTriet1);
    const cungTriet2 = diaChart.find(c => c.cungSo === viTriTriet2);
    if (cungTriet1) cungTriet1.isTriet = true;
    if (cungTriet2) cungTriet2.isTriet = true;
  }

  // ============================================
  // HELPER: ADD STAR
  // ============================================

  private addStar(diaChart: CungInfo[], viTri: number, star: StarInfo): void {
    const cung = diaChart.find(c => c.cungSo === viTri);
    if (!cung) return;

    // Check for duplicate - don't add same star twice
    if (cung.sao.some(s => s.saoID === star.saoID)) {
      return;
    }

    // Get đặc tính (brightness)
    const dacTinhInfo = DAC_TINH_SAO[star.saoID];
    const dacTinh = dacTinhInfo?.[viTri] ?? undefined;

    cung.sao.push({
      saoID: star.saoID,
      saoTen: star.saoTen,
      saoNguHanh: star.saoNguHanh,
      saoLoai: star.saoLoai,
      saoDacTinh: dacTinh,
      vongTrangSinh: star.vongTrangSinh,
    });
  }

  // ============================================
  // CREATE THIEN BAN INFO
  // ============================================

  private createThienBan(
    input: TuViInput,
    lunarDate: LunarDateInfo,
    canChi: CanChiInfo,
    cucInfo: any,
    canNam: number,
    chiNam: number,
    cungMenh: number,
    amDuongNamSinh: number,
    gioiTinh: number
  ): ThienBanInfo {
    const banMenh = nguHanhNapAm(chiNam, canNam, true);
    const cungAmDuong = cungMenh % 2 === 1 ? 1 : -1;

    let amDuongMenh: string;
    if (cungAmDuong * gioiTinh === 1) {
      amDuongMenh = 'Âm dương thuận lý';
    } else {
      amDuongMenh = 'Âm dương nghịch lý';
    }

    // Sinh khắc Mệnh - Cục
    const menhHanh = nguHanhNapAm(chiNam, canNam);
    const menhId = NGU_HANH[menhHanh]?.id ?? 1;
    const cucId = cucInfo?.id ?? 1;
    const menhCucRelation = sinhKhac(menhId, cucId);

    let sinhKhacText: string;
    if (menhCucRelation === 1) {
      sinhKhacText = 'Bản Mệnh sinh Cục';
    } else if (menhCucRelation === -1) {
      sinhKhacText = 'Bản Mệnh khắc Cục';
    } else if (menhCucRelation === '-1j') {
      sinhKhacText = 'Cục khắc Bản Mệnh';
    } else if (menhCucRelation === '1j') {
      sinhKhacText = 'Cục sinh Bản Mệnh';
    } else {
      sinhKhacText = 'Cục hòa Bản Mệnh';
    }

    return {
      ten: input.fullName,
      gioiTinh: input.gender === 'male' ? 'Nam' : 'Nữ',
      ngayDuong: this.formatSolarDate(input.birthDate),
      ngayAm: this.lunarService.formatLunarDate(lunarDate),
      gioSinh: `${canChi.hour.canTen} ${canChi.hour.chiTen}`,
      canChiNam: `${canChi.year.canTen} ${canChi.year.chiTen}`,
      canChiThang: `${canChi.month.canTen} ${canChi.month.chiTen}`,
      canChiNgay: `${canChi.day.canTen} ${canChi.day.chiTen}`,
      canChiGio: `${canChi.hour.canTen} ${canChi.hour.chiTen}`,
      cuc: cucInfo?.tenCuc ?? '',
      banMenh,
      menhChu: DIA_CHI[chiNam]?.menhChu ?? '',
      thanChu: DIA_CHI[chiNam]?.thanChu ?? '',
      amDuongNamSinh: amDuongNamSinh === 1 ? 'Dương' : 'Âm',
      amDuongMenh,
      sinhKhac: sinhKhacText,
    };
  }

  private formatSolarDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

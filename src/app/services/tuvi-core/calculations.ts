/**
 * Tử Vi Calculation Utilities
 * Based on lasotuvi Python implementation by doanguyen
 */

import { THIEN_CAN, DIA_CHI, NGU_HANH, MA_TRAN_NAP_AM, BAN_MENH } from './constants';

// ============================================
// DỊCH CUNG (Move Palace Position)
// ============================================

/**
 * Dịch chuyển vị trí cung
 * @param cungBanDau Cung ban đầu (1-12)
 * @param soCungDich Số cung cần dịch (có thể âm)
 * @returns Vị trí cung mới (1-12)
 */
export function dichCung(cungBanDau: number, ...args: number[]): number {
  let cungSauKhiDich = Math.floor(cungBanDau);
  for (const soCungDich of args) {
    cungSauKhiDich += Math.floor(soCungDich);
  }
  const result = cungSauKhiDich % 12;
  return result === 0 ? 12 : (result > 0 ? result : result + 12);
}

/**
 * Tính khoảng cách giữa 2 cung
 */
export function khoangCachCung(cung1: number, cung2: number, chieu: number = 1): number {
  if (chieu === 1) {
    return (cung1 - cung2 + 12) % 12;
  } else {
    return (cung2 - cung1 + 12) % 12;
  }
}

// ============================================
// NGŨ HÀNH NẠP ÂM
// ============================================

/**
 * Tìm Ngũ Hành Nạp Âm của năm
 * @param diaChi Chi của năm (1-12)
 * @param thienCan Can của năm (1-10)
 * @param xuatBanMenh Trả về tên bản mệnh đầy đủ
 */
export function nguHanhNapAm(
  diaChi: number,
  thienCan: number,
  xuatBanMenh: boolean = false
): string {
  const nh = MA_TRAN_NAP_AM[diaChi]?.[thienCan];
  if (nh && typeof nh === 'string' && nh[0] in NGU_HANH) {
    if (xuatBanMenh) {
      return BAN_MENH[nh] || nh;
    }
    return nh[0]; // K, M, T, H, O
  }
  throw new Error('Không tìm được Ngũ hành nạp âm');
}

/**
 * Tính tương sinh/tương khắc giữa 2 hành
 * @returns 0: hòa, 1: sinh, -1: khắc, 1j: bị sinh, -1j: bị khắc
 */
export function sinhKhac(hanh1: number, hanh2: number): number | string {
  const matrix: (number | string)[][] = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, -1, 1, '-1j', '1j'],
    [0, '-1j', 0, '1j', 1, -1],
    [0, '1j', 1, 0, 1, '-1j'],
    [0, -1, '1j', '-1j', 0, 1],
    [0, 1, '-1j', -1, '1j', 0],
  ];
  return matrix[hanh1]?.[hanh2] ?? 0;
}

// ============================================
// TÌM CỤC
// ============================================

/**
 * Tìm số Cục từ vị trí cung Mệnh và Can năm sinh
 * @returns K, M, T, H, O
 */
export function timCuc(viTriCungMenhTrenDiaBan: number, canNamSinh: number): string {
  const canThangGieng = (canNamSinh * 2 + 1) % 10;
  let canThangMenh = ((viTriCungMenhTrenDiaBan - 3) % 12 + canThangGieng) % 10;
  if (canThangMenh === 0) {
    canThangMenh = 10;
  }
  return nguHanhNapAm(viTriCungMenhTrenDiaBan, canThangMenh);
}

// ============================================
// TÌM VỊ TRÍ SAO TỬ VI
// ============================================

/**
 * Tìm vị trí sao Tử Vi
 * @param cuc Số cục (2, 3, 4, 5, 6)
 * @param ngaySinhAmLich Ngày sinh âm lịch
 */
export function timTuVi(cuc: number, ngaySinhAmLich: number): number {
  const cungDan = 3; // Cung Dần = 3
  let cucSo = cuc;
  let cungBanDau = cungDan;

  if (![2, 3, 4, 5, 6].includes(cuc)) {
    throw new Error('Số cục phải là 2, 3, 4, 5, 6');
  }

  while (cucSo < ngaySinhAmLich) {
    cucSo += cuc;
    cungBanDau += 1;
  }

  let saiLech = cucSo - ngaySinhAmLich;
  if (saiLech % 2 === 1) {
    saiLech = -saiLech; // Nếu lẻ thì lùi
  }

  return dichCung(cungBanDau, saiLech);
}

// ============================================
// TÌM TRÀNG SINH
// ============================================

/**
 * Tìm vị trí sao Tràng Sinh
 * Dương Nam - Âm Nữ: thuận
 * Âm Nam - Dương Nữ: nghịch
 */
export function timTrangSinh(cucSo: number): number {
  switch (cucSo) {
    case 6: return 3;  // Hỏa lục cục -> Dần
    case 4: return 6;  // Kim tứ cục -> Tỵ
    case 2:
    case 5: return 9;  // Thủy nhị cục, Thổ ngũ cục -> Thân
    case 3: return 12; // Mộc tam cục -> Hợi
    default:
      throw new Error('Không tìm được cung an sao Trường sinh');
  }
}

// ============================================
// TÌM HỎA LINH
// ============================================

export function timHoaLinh(
  chiNamSinh: number,
  gioSinh: number,
  gioiTinh: number,
  amDuongNamSinh: number
): [number, number] {
  let khoiCungHoaTinh: number;
  let khoiCungLinhTinh: number;

  if ([3, 7, 11].includes(chiNamSinh)) {
    khoiCungHoaTinh = 2;
    khoiCungLinhTinh = 4;
  } else if ([1, 5, 9].includes(chiNamSinh)) {
    khoiCungHoaTinh = 3;
    khoiCungLinhTinh = 11;
  } else if ([6, 10, 2].includes(chiNamSinh)) {
    khoiCungHoaTinh = 11;
    khoiCungLinhTinh = 4;
  } else if ([12, 4, 8].includes(chiNamSinh)) {
    khoiCungHoaTinh = 10;
    khoiCungLinhTinh = 11;
  } else {
    throw new Error('Không thể khởi cung tìm Hỏa-Linh');
  }

  let viTriHoaTinh: number;
  let viTriLinhTinh: number;

  if (gioiTinh * amDuongNamSinh === -1) {
    viTriHoaTinh = dichCung(khoiCungHoaTinh + 1, -gioSinh);
    viTriLinhTinh = dichCung(khoiCungLinhTinh - 1, gioSinh);
  } else {
    viTriHoaTinh = dichCung(khoiCungHoaTinh - 1, gioSinh);
    viTriLinhTinh = dichCung(khoiCungLinhTinh + 1, -gioSinh);
  }

  return [viTriHoaTinh, viTriLinhTinh];
}

// ============================================
// TÌM CÁC SAO KHÁC
// ============================================

export function timThienKhoi(canNam: number): number {
  const khoiViet = [0, 2, 1, 12, 10, 8, 1, 8, 7, 6, 4];
  return khoiViet[canNam] ?? 0;
}

export function timThienQuanThienPhuc(canNam: number): [number, number] {
  const thienQuan = [0, 8, 5, 6, 3, 4, 10, 12, 10, 11, 7];
  const thienPhuc = [0, 10, 9, 1, 12, 4, 3, 7, 6, 7, 6];
  return [thienQuan[canNam] ?? 0, thienPhuc[canNam] ?? 0];
}

export function timCoThan(chiNam: number): number {
  if ([12, 1, 2].includes(chiNam)) return 3;
  if ([3, 4, 5].includes(chiNam)) return 6;
  if ([6, 7, 8].includes(chiNam)) return 9;
  return 12;
}

export function timThienMa(chiNam: number): number {
  const demNghich = chiNam % 4;
  switch (demNghich) {
    case 1: return 3;
    case 2: return 12;
    case 3: return 9;
    case 0: return 6;
    default: throw new Error('Không tìm được Thiên mã');
  }
}

export function timPhaToai(chiNam: number): number {
  const demNghich = chiNam % 3;
  switch (demNghich) {
    case 0: return 6;
    case 1: return 10;
    case 2: return 2;
    default: throw new Error('Không tìm được Phá toái');
  }
}

export function timTriet(canNam: number): [number, number] {
  if ([1, 6].includes(canNam)) return [9, 10];  // Giáp Kỷ -> Thân Dậu
  if ([2, 7].includes(canNam)) return [7, 8];   // Ất Canh -> Ngọ Mùi
  if ([3, 8].includes(canNam)) return [5, 6];   // Bính Tân -> Thìn Tỵ
  if ([4, 9].includes(canNam)) return [3, 4];   // Đinh Nhâm -> Dần Mão
  if ([5, 10].includes(canNam)) return [1, 2];  // Mậu Quý -> Tý Sửu
  throw new Error('Không tìm được Triệt');
}

export function timLuuTru(canNam: number): [number, number] {
  const maTranLuuHa = [0, 10, 11, 8, 5, 6, 7, 9, 4, 12, 3];
  const maTranThienTru = [0, 6, 7, 1, 6, 7, 9, 3, 7, 10, 11];
  return [maTranLuuHa[canNam] ?? 0, maTranThienTru[canNam] ?? 0];
}

// ============================================
// TỨ HÓA (Lộc - Quyền - Khoa - Kỵ)
// ============================================

export interface TuHoaResult {
  hoaLoc: number;
  hoaQuyen: number;
  hoaKhoa: number;
  hoaKy: number;
}

/**
 * Tìm vị trí Tứ Hóa dựa trên Can năm và vị trí các sao chính tinh
 * Trả về các saoID sẽ nhận Tứ Hóa
 */
export function getTuHoaSaoId(canNam: number): {
  loc: number;
  quyen: number;
  khoa: number;
  ky: number;
} {
  // Theo cụ Thiên Lương - Số tử vi dưới mắt khoa học
  // saoID: 1-Tử Vi, 2-Liêm Trinh, 3-Thiên Đồng, 4-Vũ Khúc, 5-Thái Dương,
  //        6-Thiên Cơ, 7-Thiên Phủ, 8-Thái Âm, 9-Tham Lang, 10-Cự Môn,
  //        11-Thiên Tướng, 12-Thiên Lương, 13-Thất Sát, 14-Phá Quân
  //        57-Văn Xương, 58-Văn Khúc, 62-Hữu Bật
  const tuHoaTable: Record<number, { loc: number; quyen: number; khoa: number; ky: number }> = {
    1: { loc: 2, quyen: 14, khoa: 4, ky: 5 },     // Giáp: Liêm Trinh, Phá Quân, Vũ Khúc, Thái Dương
    2: { loc: 6, quyen: 12, khoa: 1, ky: 8 },     // Ất: Thiên Cơ, Thiên Lương, Tử Vi, Thái Âm
    3: { loc: 3, quyen: 6, khoa: 57, ky: 2 },     // Bính: Thiên Đồng, Thiên Cơ, Văn Xương, Liêm Trinh
    4: { loc: 8, quyen: 3, khoa: 6, ky: 10 },     // Đinh: Thái Âm, Thiên Đồng, Thiên Cơ, Cự Môn
    5: { loc: 9, quyen: 8, khoa: 62, ky: 6 },     // Mậu: Tham Lang, Thái Âm, Hữu Bật, Thiên Cơ
    6: { loc: 4, quyen: 9, khoa: 12, ky: 58 },    // Kỷ: Vũ Khúc, Tham Lang, Thiên Lương, Văn Khúc
    7: { loc: 5, quyen: 4, khoa: 3, ky: 8 },      // Canh: Thái Dương, Vũ Khúc, Thiên Đồng, Thái Âm
    8: { loc: 10, quyen: 5, khoa: 58, ky: 57 },   // Tân: Cự Môn, Thái Dương, Văn Khúc, Văn Xương
    9: { loc: 12, quyen: 1, khoa: 7, ky: 4 },     // Nhâm: Thiên Lương, Tử Vi, Thiên Phủ, Vũ Khúc
    10: { loc: 14, quyen: 10, khoa: 8, ky: 9 },   // Quý: Phá Quân, Cự Môn, Thái Âm, Tham Lang
  };

  return tuHoaTable[canNam] ?? { loc: 0, quyen: 0, khoa: 0, ky: 0 };
}

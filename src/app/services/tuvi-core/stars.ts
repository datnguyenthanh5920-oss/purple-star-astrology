/**
 * Star Definitions for Tử Vi
 * Based on lasotuvi Python implementation by doanguyen
 */

export interface StarInfo {
  saoID: number;
  saoTen: string;
  saoNguHanh: string; // K M T H O
  saoLoai: number; // 1: Chính tinh, 2-10: Tốt, 11+: Xấu
  saoPhuongVi?: string;
  saoAmDuong?: number;
  vongTrangSinh?: boolean;
  saoDacTinh?: string; // M V Đ B H
}

// Factory function to create star
function createStar(
  saoID: number,
  saoTen: string,
  saoNguHanh: string,
  saoLoai: number = 2,
  saoPhuongVi: string = '',
  saoAmDuong: number = 0,
  vongTrangSinh: boolean = false
): StarInfo {
  return {
    saoID,
    saoTen,
    saoNguHanh,
    saoLoai,
    saoPhuongVi,
    saoAmDuong,
    vongTrangSinh,
  };
}

// ============================================
// TỬ VI TINH HỆ (14 Chính Tinh)
// ============================================

export const SAO_TU_VI = createStar(1, 'Tử vi', 'O', 1, 'Đế tinh', 1);
export const SAO_LIEM_TRINH = createStar(2, 'Liêm trinh', 'H', 1, 'Bắc đẩu tinh', 1);
export const SAO_THIEN_DONG = createStar(3, 'Thiên đồng', 'T', 1, 'Bắc đẩu tinh', 1);
export const SAO_VU_KHUC = createStar(4, 'Vũ khúc', 'K', 1, 'Bắc đẩu tinh', -1);
export const SAO_THAI_DUONG = createStar(5, 'Thái dương', 'H', 1, 'Nam đẩu tinh', 1);
export const SAO_THIEN_CO = createStar(6, 'Thiên cơ', 'M', 1, 'Nam đẩu tinh', -1);

// ============================================
// THIÊN PHỦ TINH HỆ
// ============================================

export const SAO_THIEN_PHU = createStar(7, 'Thiên phủ', 'O', 1, 'Nam đẩu tinh', 1);
export const SAO_THAI_AM = createStar(8, 'Thái âm', 'T', 1, 'Bắc đẩu tinh', -1);
export const SAO_THAM_LANG = createStar(9, 'Tham lang', 'T', 1, 'Bắc đẩu tinh', -1);
export const SAO_CU_MON = createStar(10, 'Cự môn', 'T', 1, 'Bắc đẩu tinh', -1);
export const SAO_THIEN_TUONG = createStar(11, 'Thiên tướng', 'T', 1, 'Nam đẩu tinh', 1);
export const SAO_THIEN_LUONG = createStar(12, 'Thiên lương', 'M', 1, 'Nam đẩu tinh', -1);
export const SAO_THAT_SAT = createStar(13, 'Thất sát', 'K', 1, 'Nam đẩu tinh', 1);
export const SAO_PHA_QUAN = createStar(14, 'Phá quân', 'T', 1, 'Bắc đẩu tinh', -1);

// ============================================
// VÒNG ĐỊA CHI - THÁI TUẾ
// ============================================

export const SAO_THAI_TUE = createStar(15, 'Thái tuế', 'H', 15);
export const SAO_THIEU_DUONG = createStar(16, 'Thiếu dương', 'H', 5);
export const SAO_TANG_MON = createStar(17, 'Tang môn', 'M', 12);
export const SAO_THIEU_AM = createStar(18, 'Thiếu âm', 'T', 5);
export const SAO_QUAN_PHU_3 = createStar(19, 'Quan phù', 'H', 12);
export const SAO_TU_PHU = createStar(20, 'Tử phù', 'K', 12);
export const SAO_TUE_PHA = createStar(21, 'Tuế phá', 'H', 12);
export const SAO_LONG_DUC = createStar(22, 'Long đức', 'T', 5);
export const SAO_BACH_HO = createStar(23, 'Bạch hổ', 'K', 12);
export const SAO_PHUC_DUC = createStar(24, 'Phúc đức', 'O', 5);
export const SAO_DIEU_KHACH = createStar(25, 'Điếu khách', 'H', 12);
export const SAO_TRUC_PHU = createStar(26, 'Trực phù', 'K', 16);

// ============================================
// VÒNG THIÊN CAN - LỘC TỒN
// ============================================

export const SAO_LOC_TON = createStar(27, 'Lộc tồn', 'O', 3, 'Bắc đẩu tinh');
export const SAO_BAC_SY = createStar(109, 'Bác sỹ', 'T', 5);
export const SAO_LUC_SI = createStar(28, 'Lực sĩ', 'H', 2);
export const SAO_THANH_LONG = createStar(29, 'Thanh long', 'T', 5);
export const SAO_TIEU_HAO = createStar(30, 'Tiểu hao', 'H', 12);
export const SAO_TUONG_QUAN = createStar(31, 'Tướng quân', 'M', 4);
export const SAO_TAU_THU = createStar(32, 'Tấu thư', 'K', 3);
export const SAO_PHI_LIEM = createStar(33, 'Phi liêm', 'H', 2);
export const SAO_HY_THAN = createStar(34, 'Hỷ thần', 'H', 5);
export const SAO_BENH_PHU = createStar(35, 'Bệnh phù', 'O', 12);
export const SAO_DAI_HAO = createStar(36, 'Đại hao', 'H', 12);
export const SAO_PHUC_BINH = createStar(37, 'Phục binh', 'H', 13);
export const SAO_QUAN_PHU_2 = createStar(38, 'Quan phù', 'H', 12);

// ============================================
// VÒNG TRÀNG SINH
// ============================================

export const SAO_TRANG_SINH = createStar(39, 'Tràng sinh', 'T', 5, '', 0, true);
export const SAO_MOC_DUC = createStar(40, 'Mộc dục', 'T', 14, '', 0, true);
export const SAO_QUAN_DOI = createStar(41, 'Quan đới', 'K', 4, '', 0, true);
export const SAO_LAM_QUAN = createStar(42, 'Lâm quan', 'K', 7, '', 0, true);
export const SAO_DE_VUONG = createStar(43, 'Đế vượng', 'K', 5, '', 0, true);
export const SAO_SUY = createStar(44, 'Suy', 'T', 12, '', 0, true);
export const SAO_BENH = createStar(45, 'Bệnh', 'H', 12, '', 0, true);
export const SAO_TU = createStar(46, 'Tử', 'H', 12, '', 0, true);
export const SAO_MO = createStar(47, 'Mộ', 'O', 2, '', 0, true);
export const SAO_TUYET = createStar(48, 'Tuyệt', 'O', 12, '', 0, true);
export const SAO_THAI = createStar(49, 'Thai', 'O', 14, '', 0, true);
export const SAO_DUONG = createStar(50, 'Dưỡng', 'M', 2, '', 0, true);

// ============================================
// LỤC SÁT
// ============================================

export const SAO_DA_LA = createStar(51, 'Đà la', 'K', 11);
export const SAO_KINH_DUONG = createStar(52, 'Kình dương', 'K', 11);
export const SAO_DIA_KHONG = createStar(53, 'Địa không', 'H', 11);
export const SAO_DIA_KIEP = createStar(54, 'Địa kiếp', 'H', 11);
export const SAO_LINH_TINH = createStar(55, 'Linh tinh', 'H', 11);
export const SAO_HOA_TINH = createStar(56, 'Hỏa tinh', 'H', 11);

// ============================================
// SAO ÂM DƯƠNG
// ============================================

export const SAO_VAN_XUONG = createStar(57, 'Văn xương', 'K', 6);
export const SAO_VAN_KHUC = createStar(58, 'Văn khúc', 'T', 6);
export const SAO_THIEN_KHOI = createStar(59, 'Thiên khôi', 'H', 6);
export const SAO_THIEN_VIET = createStar(60, 'Thiên việt', 'H', 6);
export const SAO_TA_PHU = createStar(61, 'Tả phù', 'O', 2);
export const SAO_HUU_BAT = createStar(62, 'Hữu bật', 'O', 2);
export const SAO_LONG_TRI = createStar(63, 'Long trì', 'T', 3);
export const SAO_PHUONG_CAC = createStar(64, 'Phượng các', 'O', 3);
export const SAO_TAM_THAI = createStar(65, 'Tam thai', 'M', 7);
export const SAO_BAT_TOA = createStar(66, 'Bát tọa', 'T', 7);
export const SAO_AN_QUANG = createStar(67, 'Ân quang', 'M', 3);
export const SAO_THIEN_QUY = createStar(68, 'Thiên quý', 'O', 3);

// ============================================
// SAO ĐÔI KHÁC
// ============================================

export const SAO_THIEN_KHOC = createStar(69, 'Thiên khốc', 'T', 12);
export const SAO_THIEN_HU = createStar(70, 'Thiên hư', 'T', 12);
export const SAO_THIEN_DUC = createStar(71, 'Thiên đức', 'H', 5);
export const SAO_NGUYET_DUC = createStar(72, 'Nguyệt đức', 'H', 5);
export const SAO_THIEN_HINH = createStar(73, 'Thiên hình', 'H', 15);
export const SAO_THIEN_RIEU = createStar(74, 'Thiên riêu', 'T', 13);
export const SAO_THIEN_Y = createStar(75, 'Thiên y', 'T', 5);
export const SAO_QUOC_AN = createStar(76, 'Quốc ấn', 'O', 6);
export const SAO_DUONG_PHU = createStar(77, 'Đường phù', 'M', 4);
export const SAO_DAO_HOA = createStar(78, 'Đào hoa', 'M', 8);
export const SAO_HONG_LOAN = createStar(79, 'Hồng loan', 'T', 8);
export const SAO_THIEN_HY = createStar(80, 'Thiên hỷ', 'T', 5);
export const SAO_THIEN_GIAI = createStar(81, 'Thiên giải', 'H', 5);
export const SAO_DIA_GIAI = createStar(82, 'Địa giải', 'O', 5);
export const SAO_GIAI_THAN = createStar(83, 'Giải thần', 'M', 5);
export const SAO_THAI_PHU = createStar(84, 'Thai phụ', 'K', 6);
export const SAO_PHONG_CAO = createStar(85, 'Phong cáo', 'O', 4);
export const SAO_THIEN_TAI = createStar(86, 'Thiên tài', 'O', 2);
export const SAO_THIEN_THO = createStar(87, 'Thiên thọ', 'O', 5);
export const SAO_THIEN_THUONG = createStar(88, 'Thiên thương', 'O', 12);
export const SAO_THIEN_SU = createStar(89, 'Thiên sứ', 'T', 12);
export const SAO_THIEN_LA = createStar(90, 'Thiên la', 'O', 12);
export const SAO_DIA_VONG = createStar(91, 'Địa võng', 'O', 12);
export const SAO_HOA_KHOA = createStar(92, 'Hóa khoa', 'T', 5);
export const SAO_HOA_QUYEN = createStar(93, 'Hóa quyền', 'T', 4);
export const SAO_HOA_LOC = createStar(94, 'Hóa lộc', 'M', 3);
export const SAO_HOA_KY = createStar(95, 'Hóa kỵ', 'T', 13);
export const SAO_CO_THAN = createStar(96, 'Cô thần', 'O', 13);
export const SAO_QUA_TU = createStar(97, 'Quả tú', 'O', 13);
export const SAO_THIEN_MA = createStar(98, 'Thiên mã', 'H', 3);
export const SAO_PHA_TOAI = createStar(99, 'Phá toái', 'H', 12);
export const SAO_THIEN_QUAN = createStar(100, 'Thiên quan', 'H', 5);
export const SAO_THIEN_PHUC = createStar(101, 'Thiên phúc', 'H', 5);
export const SAO_LUU_HA = createStar(102, 'Lưu hà', 'T', 12);
export const SAO_THIEN_TRU = createStar(103, 'Thiên trù', 'O', 5);
export const SAO_KIEP_SAT = createStar(104, 'Kiếp sát', 'H', 11);
export const SAO_HOA_CAI = createStar(105, 'Hoa cái', 'K', 14);
export const SAO_VAN_TINH = createStar(106, 'Văn tinh', 'H', 6);
export const SAO_DAU_QUAN = createStar(107, 'Đẩu quân', 'H', 5);
export const SAO_THIEN_KHONG = createStar(108, 'Thiên không', 'T', 11);

// ============================================
// ĐẶC TÍNH SAO (Brightness Matrix)
// ============================================

export const DAC_TINH_SAO: Record<number, string[]> = {
  // saoID: [name, Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi]
  1: ['Tử vi', 'B', 'Đ', 'M', 'B', 'V', 'M', 'M', 'Đ', 'M', 'B', 'V', 'B'],
  2: ['Liêm trinh', 'V', 'Đ', 'V', 'H', 'M', 'H', 'V', 'Đ', 'V', 'H', 'M', 'H'],
  3: ['Thiên đồng', 'V', 'H', 'M', 'Đ', 'H', 'Đ', 'H', 'H', 'M', 'H', 'H', 'Đ'],
  4: ['Vũ khúc', 'V', 'M', 'V', 'Đ', 'M', 'H', 'V', 'M', 'V', 'Đ', 'M', 'H'],
  5: ['Thái dương', 'H', 'Đ', 'V', 'V', 'V', 'M', 'M', 'Đ', 'H', 'H', 'H', 'H'],
  6: ['Thiên cơ', 'Đ', 'Đ', 'H', 'M', 'M', 'V', 'Đ', 'Đ', 'V', 'M', 'M', 'H'],
  8: ['Thái âm', 'V', 'Đ', 'H', 'H', 'H', 'H', 'H', 'Đ', 'V', 'M', 'M', 'M'],
  9: ['Tham lang', 'H', 'M', 'Đ', 'H', 'V', 'H', 'H', 'M', 'Đ', 'H', 'V', 'H'],
  10: ['Cự môn', 'V', 'H', 'V', 'M', 'H', 'H', 'V', 'H', 'Đ', 'M', 'H', 'Đ'],
  11: ['Thiên tướng', 'V', 'Đ', 'M', 'H', 'V', 'Đ', 'V', 'Đ', 'M', 'H', 'V', 'Đ'],
  12: ['Thiên lương', 'V', 'Đ', 'V', 'V', 'M', 'H', 'M', 'Đ', 'V', 'H', 'M', 'H'],
  13: ['Thất sát', 'M', 'Đ', 'M', 'H', 'H', 'V', 'M', 'Đ', 'M', 'H', 'H', 'V'],
  14: ['Phá quân', 'M', 'V', 'H', 'H', 'Đ', 'H', 'M', 'V', 'H', 'H', 'Đ', 'H'],
  51: ['Đà la', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  52: ['Kình dương', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  55: ['Linh tinh', 'H', 'H', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'H', 'H', 'H', 'H', 'H'],
  56: ['Hỏa tinh', 'H', 'H', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'H', 'H', 'H', 'H', 'H'],
  57: ['Văn xương', 'H', 'Đ', 'H', 'Đ', 'H', 'Đ', 'H', 'Đ', 'H', 'H', 'Đ', 'Đ'],
  58: ['Văn khúc', 'H', 'Đ', 'H', 'Đ', 'H', 'Đ', 'H', 'Đ', 'H', 'H', 'Đ', 'Đ'],
  53: ['Địa không', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ'],
  54: ['Địa kiếp', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ'],
};

/**
 * Tử Vi Core Constants
 * Based on lasotuvi Python implementation by doanguyen
 * https://github.com/doanguyen/lasotuvi
 */

// ============================================
// THIÊN CAN (Heavenly Stems)
// ============================================

export interface ThienCan {
  id: number;
  chuCaiDau: string | null;
  tenCan: string | null;
  nguHanh: string | null; // K M T H O
  nguHanhID: number | null;
  vitriDiaBan: number | null;
  amDuong: 1 | -1 | null; // 1 = Dương, -1 = Âm
}

export const THIEN_CAN: ThienCan[] = [
  { id: 0, chuCaiDau: null, tenCan: null, nguHanh: null, nguHanhID: null, vitriDiaBan: null, amDuong: null },
  { id: 1, chuCaiDau: 'G', tenCan: 'Giáp', nguHanh: 'M', nguHanhID: 2, vitriDiaBan: 3, amDuong: 1 },
  { id: 2, chuCaiDau: 'A', tenCan: 'Ất', nguHanh: 'M', nguHanhID: 2, vitriDiaBan: 4, amDuong: -1 },
  { id: 3, chuCaiDau: 'B', tenCan: 'Bính', nguHanh: 'H', nguHanhID: 4, vitriDiaBan: 6, amDuong: 1 },
  { id: 4, chuCaiDau: 'D', tenCan: 'Đinh', nguHanh: 'H', nguHanhID: 4, vitriDiaBan: 7, amDuong: -1 },
  { id: 5, chuCaiDau: 'M', tenCan: 'Mậu', nguHanh: 'O', nguHanhID: 5, vitriDiaBan: 6, amDuong: 1 },
  { id: 6, chuCaiDau: 'K', tenCan: 'Kỷ', nguHanh: 'O', nguHanhID: 5, vitriDiaBan: 7, amDuong: -1 },
  { id: 7, chuCaiDau: 'C', tenCan: 'Canh', nguHanh: 'K', nguHanhID: 1, vitriDiaBan: 9, amDuong: 1 },
  { id: 8, chuCaiDau: 'T', tenCan: 'Tân', nguHanh: 'K', nguHanhID: 1, vitriDiaBan: 10, amDuong: -1 },
  { id: 9, chuCaiDau: 'N', tenCan: 'Nhâm', nguHanh: 'T', nguHanhID: 3, vitriDiaBan: 12, amDuong: 1 },
  { id: 10, chuCaiDau: 'Q', tenCan: 'Quý', nguHanh: 'T', nguHanhID: 3, vitriDiaBan: 1, amDuong: -1 },
];

// ============================================
// ĐỊA CHI (Earthly Branches)
// ============================================

export interface DiaChi {
  id: number;
  tenChi: string;
  tenHanh: string;
  menhChu?: string;
  thanChu?: string;
  amDuong: 1 | -1 | 0;
}

export const DIA_CHI: DiaChi[] = [
  { id: 0, tenChi: '', tenHanh: '', amDuong: 0 },
  { id: 1, tenChi: 'Tý', tenHanh: 'T', menhChu: 'Tham lang', thanChu: 'Linh tinh', amDuong: 1 },
  { id: 2, tenChi: 'Sửu', tenHanh: 'O', menhChu: 'Cự môn', thanChu: 'Thiên tướng', amDuong: -1 },
  { id: 3, tenChi: 'Dần', tenHanh: 'M', menhChu: 'Lộc tồn', thanChu: 'Thiên lương', amDuong: 1 },
  { id: 4, tenChi: 'Mão', tenHanh: 'M', menhChu: 'Văn khúc', thanChu: 'Thiên đồng', amDuong: -1 },
  { id: 5, tenChi: 'Thìn', tenHanh: 'O', menhChu: 'Liêm trinh', thanChu: 'Văn xương', amDuong: 1 },
  { id: 6, tenChi: 'Tỵ', tenHanh: 'H', menhChu: 'Vũ khúc', thanChu: 'Thiên cơ', amDuong: -1 },
  { id: 7, tenChi: 'Ngọ', tenHanh: 'H', menhChu: 'Phá quân', thanChu: 'Hỏa tinh', amDuong: 1 },
  { id: 8, tenChi: 'Mùi', tenHanh: 'O', menhChu: 'Vũ khúc', thanChu: 'Thiên tướng', amDuong: -1 },
  { id: 9, tenChi: 'Thân', tenHanh: 'K', menhChu: 'Liêm trinh', thanChu: 'Thiên lương', amDuong: 1 },
  { id: 10, tenChi: 'Dậu', tenHanh: 'K', menhChu: 'Văn khúc', thanChu: 'Thiên đồng', amDuong: -1 },
  { id: 11, tenChi: 'Tuất', tenHanh: 'O', menhChu: 'Lộc tồn', thanChu: 'Văn xương', amDuong: 1 },
  { id: 12, tenChi: 'Hợi', tenHanh: 'T', menhChu: 'Cự môn', thanChu: 'Thiên cơ', amDuong: -1 },
];

// ============================================
// NGŨ HÀNH (Five Elements)
// ============================================

export interface NguHanh {
  id: number;
  tenHanh: string;
  cuc: number;
  tenCuc: string;
  css: string;
}

export const NGU_HANH: Record<string, NguHanh> = {
  K: { id: 1, tenHanh: 'Kim', cuc: 4, tenCuc: 'Kim tứ Cục', css: 'hanhKim' },
  M: { id: 2, tenHanh: 'Mộc', cuc: 3, tenCuc: 'Mộc tam Cục', css: 'hanhMoc' },
  T: { id: 3, tenHanh: 'Thủy', cuc: 2, tenCuc: 'Thủy nhị Cục', css: 'hanhThuy' },
  H: { id: 4, tenHanh: 'Hỏa', cuc: 6, tenCuc: 'Hỏa lục Cục', css: 'hanhHoa' },
  O: { id: 5, tenHanh: 'Thổ', cuc: 5, tenCuc: 'Thổ ngũ Cục', css: 'hanhTho' },
};

// ============================================
// NGŨ HÀNH NẠP ÂM (60 Giáp Tý cycle)
// ============================================

export const BAN_MENH: Record<string, string> = {
  K1: 'HẢI TRUNG KIM',
  T1: 'GIÁNG HẠ THỦY',
  H1: 'TÍCH LỊCH HỎA',
  O1: 'BÍCH THƯỢNG THỔ',
  M1: 'TANG ĐỐ MỘC',
  T2: 'ĐẠI KHÊ THỦY',
  H2: 'LƯ TRUNG HỎA',
  O2: 'THÀNH ĐẦU THỔ',
  M2: 'TÒNG BÁ MỘC',
  K2: 'KIM BẠCH KIM',
  H3: 'PHÚ ĐĂNG HỎA',
  O3: 'SA TRUNG THỔ',
  M3: 'ĐẠI LÂM MỘC',
  K3: 'BẠCH LẠP KIM',
  T3: 'TRƯỜNG LƯU THỦY',
  K4: 'SA TRUNG KIM',
  T4: 'THIÊN HÀ THỦY',
  H4: 'THIÊN THƯỢNG HỎA',
  O4: 'LỘ BÀN THỔ',
  M4: 'DƯƠNG LIỄU MỘC',
  T5: 'TRUYỀN TRUNG THỦY',
  H5: 'SƠN HẠ HỎA',
  O5: 'ĐẠI TRẠCH THỔ',
  M5: 'THẠCH LỰU MỘC',
  K5: 'KIẾM PHONG KIM',
  H6: 'SƠN ĐẦU HỎA',
  O6: 'ỐC THƯỢNG THỔ',
  M6: 'BÌNH ĐỊA MỘC',
  K6: 'XOA XUYẾN KIM',
  T6: 'ĐẠI HẢI THỦY',
};

// Ma trận Nạp Âm để tra cứu Hành theo Can Chi
export const MA_TRAN_NAP_AM: (string | false)[][] = [
  ['', 'G', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'N', 'Q'],
  ['1', 'K1', false, 'T1', false, 'H1', false, 'O1', false, 'M1', false],
  ['2', false, 'K1', false, 'T1', false, 'H1', false, 'O1', false, 'M1'],
  ['3', 'T2', false, 'H2', false, 'O2', false, 'M2', false, 'K2', false],
  ['4', false, 'T2', false, 'H2', false, 'O2', false, 'M2', false, 'K2'],
  ['5', 'H3', false, 'O3', false, 'M3', false, 'K3', false, 'T3', false],
  ['6', false, 'H3', false, 'O3', false, 'M3', false, 'K3', false, 'T3'],
  ['7', 'K4', false, 'T4', false, 'H4', false, 'O4', false, 'M4', false],
  ['8', false, 'K4', false, 'T4', false, 'H4', false, 'O4', false, 'M4'],
  ['9', 'T5', false, 'H5', false, 'O5', false, 'M5', false, 'K5', false],
  ['10', false, 'T5', false, 'H5', false, 'O5', false, 'M5', false, 'K5'],
  ['11', 'H6', false, 'O6', false, 'M6', false, 'K6', false, 'T6', false],
  ['12', false, 'H6', false, 'O6', false, 'M6', false, 'K6', false, 'T6'],
];

// ============================================
// TÊN 12 CUNG
// ============================================

export const TEN_CUNG: string[] = [
  '',
  'Mệnh',
  'Phụ mẫu',
  'Phúc đức',
  'Điền trạch',
  'Quan lộc',
  'Nô bộc',
  'Thiên di',
  'Tật ách',
  'Tài bạch',
  'Tử tức',
  'Phu thê',
  'Huynh đệ',
];

// ============================================
// HÀNH CỦA CUNG
// ============================================

export const HANH_CUNG: string[] = [
  '',
  'Thủy',
  'Thổ',
  'Mộc',
  'Mộc',
  'Thổ',
  'Hỏa',
  'Hỏa',
  'Thổ',
  'Kim',
  'Kim',
  'Thổ',
  'Thủy',
];

import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TuViService, TuViChart, Palace, StarInfo } from '../../services/tuvi.service';

interface FormData {
  fullName: string;
  gender: string;
  birthDate: Date | string;
  birthTime: string;
  birthPlace: string;
}

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './result.html',
  styleUrl: './result.scss'
})
export class Result implements OnInit {
  private router = inject(Router);
  private tuViService = inject(TuViService);

  formData = signal<FormData | null>(null);
  tuViChart = signal<TuViChart | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Year selector for Lưu Niên
  selectedYear = new Date().getFullYear();
  availableYears: number[] = [];

  // Palace grid order for traditional Tu Vi layout (4x4)
  // Tỵ(5)-Ngọ(6)-Mùi(7)-Thân(8) top row
  // Thìn(4)-center-center-Dậu(9) 
  // Mão(3)-center-center-Tuất(10)
  // Dần(2)-Sửu(1)-Tý(0)-Hợi(11) bottom row
  palaceGridOrder = [
    5, 6, 7, 8,
    4, -1, -1, 9,
    3, -1, -1, 10,
    2, 1, 0, 11
  ];

  getPalaceByPosition(position: number): Palace | null {
    const chart = this.tuViChart();
    if (!chart || position < 0) return null;
    return chart.palaces[position] || null;
  }

  isCenterCell(index: number): boolean {
    return [5, 6, 9, 10].includes(index);
  }

  // Get Đại Vận palace index for current age
  getDecadalPalaceIndex(): number {
    const chart = this.tuViChart();
    if (!chart?.horoscope) return -1;
    return chart.horoscope.decadal.index;
  }

  // Get Lưu Niên palace index
  getYearlyPalaceIndex(): number {
    const chart = this.tuViChart();
    if (!chart?.horoscope) return -1;
    return chart.horoscope.yearly.index;
  }

  // Check if palace is Đại Vận palace
  isDecadalPalace(palaceIndex: number): boolean {
    return palaceIndex === this.getDecadalPalaceIndex();
  }

  // Check if palace is Lưu Niên palace
  isYearlyPalace(palaceIndex: number): boolean {
    return palaceIndex === this.getYearlyPalaceIndex();
  }

  // Get star display with brightness
  getStarDisplayClass(star: StarInfo): string {
    const classes = ['star', star.type];
    if (star.brightnessShort) {
      classes.push(`brightness-${star.brightnessShort.toLowerCase()}`);
    }
    if (star.mutagenShort) {
      classes.push('has-mutagen');
    }
    return classes.join(' ');
  }

  // Get decadal age range text
  getDecadalAgeRange(palace: Palace | null): string {
    if (!palace?.decadal?.range) return '';
    const [start, end] = palace.decadal.range;
    return `${start}-${end}`;
  }

  // Check if palace has Tuần
  isTuanPalace(palace: Palace | null): boolean {
    if (!palace) return false;
    const tuanBranches = this.tuViChart()?.tuanTriet?.tuan || [];
    return tuanBranches.includes(palace.earthlyBranch);
  }

  // Check if palace has Triệt
  isTrietPalace(palace: Palace | null): boolean {
    if (!palace) return false;
    const trietBranches = this.tuViChart()?.tuanTriet?.triet || [];
    return trietBranches.includes(palace.earthlyBranch);
  }

  // Check if palace is Vô Chính Diệu (no major stars)
  isVoChinhDieu(palace: Palace | null): boolean {
    if (!palace) return false;
    return !palace.majorStars || palace.majorStars.length === 0;
  }

  // Check if Mệnh palace is Vô Chính Diệu
  isMenhVoChinhDieu(): boolean {
    const chart = this.tuViChart();
    if (!chart) return false;
    const menhPalace = chart.palaces.find(p => p.nameVi === 'Mệnh');
    return this.isVoChinhDieu(menhPalace || null);
  }

  // List of lucky stars (Cát Tinh)
  private luckyStars = [
    '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
    '左辅', '右弼', '天魁', '天钺', '文昌', '文曲', '禄存', '天马',
    '化禄', '化权', '化科',
    'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ', 'Thái Âm',
    'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân',
    'Tả Phụ', 'Hữu Bật', 'Thiên Khôi', 'Thiên Việt', 'Văn Xương', 'Văn Khúc', 'Lộc Tồn', 'Thiên Mã',
    'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'
  ];

  // List of unlucky stars (Hung Tinh)
  private unluckyStars = [
    '擎羊', '陀罗', '火星', '铃星', '地空', '地劫', '天刑', '天姚', '天哭', '天虚', '红鸾', '天喜',
    '化忌', '孤辰', '寡宿',
    'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Thiên Hình',
    'Thiên Diêu', 'Thiên Khốc', 'Thiên Hư', 'Hồng Loan', 'Thiên Hỷ',
    'Hóa Kỵ', 'Cô Thần', 'Quả Tú'
  ];

  // Check if star is lucky
  isLuckyStar(star: StarInfo): boolean {
    return this.luckyStars.some(name => star.name.includes(name));
  }

  // Get lucky stars from palace
  getLuckyStars(palace: Palace | null): StarInfo[] {
    if (!palace) return [];
    const allStars = [...(palace.majorStars || []), ...(palace.minorStars || [])];
    return allStars.filter(s => this.isLuckyStar(s));
  }

  // Get unlucky stars from palace
  getUnluckyStars(palace: Palace | null): StarInfo[] {
    if (!palace) return [];
    const allStars = [...(palace.majorStars || []), ...(palace.minorStars || [])];
    return allStars.filter(s => !this.isLuckyStar(s));
  }

  // Get adjective stars (neutral)
  getAdjectiveStars(palace: Palace | null): StarInfo[] {
    return palace?.adjectiveStars || [];
  }

  ngOnInit() {
    // Setup year range (birth year to current + 50)
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 80; y <= currentYear + 20; y++) {
      this.availableYears.push(y);
    }

    // Get form data from router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: FormData } | undefined;

    if (state?.formData) {
      this.formData.set(state.formData);
    } else {
      const historyState = history.state as { formData: FormData } | undefined;
      if (historyState?.formData) {
        this.formData.set(historyState.formData);
      } else {
        this.router.navigate(['/']);
        return;
      }
    }

    this.generateChart();
  }

  private generateChart() {
    const data = this.formData();
    if (!data) {
      this.isLoading.set(false);
      return;
    }

    try {
      const birthDate = data.birthDate instanceof Date
        ? data.birthDate
        : new Date(data.birthDate);

      const chart = this.tuViService.generateChart({
        fullName: data.fullName,
        gender: data.gender === 'male' ? 'male' : 'female',
        birthDate: birthDate,
        birthTime: data.birthTime
      });

      console.log('Generated chart:', chart);
      console.log('Palaces:', chart.palaces);
      console.log('Horoscope:', chart.horoscope);

      this.tuViChart.set(chart);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Error generating Tu Vi chart:', err);
      this.error.set('Có lỗi xảy ra khi tạo lá số. Vui lòng thử lại.');
      this.isLoading.set(false);
    }
  }

  // Update horoscope when year changes
  onYearChange() {
    const chart = this.tuViChart();
    if (!chart?.rawAstrolabe) return;

    const newHoroscope = this.tuViService.getHoroscope(chart.rawAstrolabe, this.selectedYear);
    this.tuViChart.update(c => c ? { ...c, horoscope: newHoroscope } : c);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  printResult() {
    window.print();
  }

  shareResult() {
    alert('Tính năng chia sẻ sẽ sớm được cập nhật!');
  }
}

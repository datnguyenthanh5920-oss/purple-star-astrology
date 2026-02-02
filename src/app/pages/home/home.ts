import { Component, signal, computed, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Custom date format: dd/mm/yyyy
export const VN_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// Custom Date Adapter for dd/mm/yyyy format
export class VnDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'DD/MM/YYYY') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return date.toDateString();
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    return super.parse(value);
  }
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    { provide: DateAdapter, useClass: VnDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: VN_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' }
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements AfterViewInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isSubmitting = signal(false);

  // Animated counter signals
  statLaSo = signal(0);
  statHaiLong = signal(0);
  statKinhNghiem = signal(0);
  statHoTro = signal(0);
  countersAnimated = false;

  // Time options for select
  timeOptions = [
    { value: '23:00-01:00', label: 'Giờ Tý (23:00 - 01:00)' },
    { value: '01:00-03:00', label: 'Giờ Sửu (01:00 - 03:00)' },
    { value: '03:00-05:00', label: 'Giờ Dần (03:00 - 05:00)' },
    { value: '05:00-07:00', label: 'Giờ Mão (05:00 - 07:00)' },
    { value: '07:00-09:00', label: 'Giờ Thìn (07:00 - 09:00)' },
    { value: '09:00-11:00', label: 'Giờ Tỵ (09:00 - 11:00)' },
    { value: '11:00-13:00', label: 'Giờ Ngọ (11:00 - 13:00)' },
    { value: '13:00-15:00', label: 'Giờ Mùi (13:00 - 15:00)' },
    { value: '15:00-17:00', label: 'Giờ Thân (15:00 - 17:00)' },
    { value: '17:00-19:00', label: 'Giờ Dậu (17:00 - 19:00)' },
    { value: '19:00-21:00', label: 'Giờ Tuất (19:00 - 21:00)' },
    { value: '21:00-23:00', label: 'Giờ Hợi (21:00 - 23:00)' },
  ];

  horoscopeForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    gender: ['', Validators.required],
    birthDate: ['', Validators.required],
    birthTime: ['', Validators.required],
    birthPlace: ['']
  });

  // Form progress calculation (Zeigarnik Effect)
  formProgress = computed(() => {
    const controls = this.horoscopeForm.controls;
    let filledCount = 0;
    const totalFields = Object.keys(controls).length;

    Object.values(controls).forEach(control => {
      if (control.value && control.value.toString().trim() !== '') {
        filledCount++;
      }
    });

    return filledCount / totalFields;
  });

  // Check if step is completed
  isStep1Active = computed(() => this.formProgress() > 0);
  isStep1Completed = computed(() => this.formProgress() >= 0.6);
  isStep2Active = computed(() => this.formProgress() >= 0.6);
  isStep2Completed = computed(() => this.formProgress() === 1);
  isStep3Active = computed(() => this.formProgress() === 1);

  // Zodiac symbols for decoration
  zodiacSymbols = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  ngAfterViewInit() {
    this.setupCounterObserver();
  }

  private setupCounterObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.countersAnimated) {
          this.countersAnimated = true;
          this.animateCounters();
        }
      });
    }, { threshold: 0.3 });

    // Observe the statistics section
    setTimeout(() => {
      const statsEl = document.querySelector('.statistics');
      if (statsEl) {
        observer.observe(statsEl);
      }
    }, 100);
  }

  private animateCounters() {
    this.animateCounter(52847, (val) => this.statLaSo.set(val));
    this.animateCounter(98, (val) => this.statHaiLong.set(val));
    this.animateCounter(15, (val) => this.statKinhNghiem.set(val));
    this.animateCounter(24, (val) => this.statHoTro.set(val));
  }

  private animateCounter(target: number, setter: (val: number) => void) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setter(current);

      if (step >= steps) {
        clearInterval(timer);
        setter(target);
      }
    }, duration / steps);
  }

  async onSubmit() {
    if (this.horoscopeForm.invalid) {
      this.horoscopeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Navigate to result page with form data
    this.router.navigate(['/ket-qua'], {
      state: { formData: this.horoscopeForm.value }
    });

    this.isSubmitting.set(false);
  }
}

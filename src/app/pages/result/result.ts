import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

interface FormData {
  fullName: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.scss'
})
export class Result implements OnInit {
  private router = inject(Router);

  formData = signal<FormData | null>(null);
  isLoading = signal(true);

  // Mock result data
  fortuneLevel = signal(78);

  ngOnInit() {
    // Get form data from router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: FormData } | undefined;

    if (state?.formData) {
      this.formData.set(state.formData);
    } else {
      // Check history state
      const historyState = history.state as { formData: FormData } | undefined;
      if (historyState?.formData) {
        this.formData.set(historyState.formData);
      } else {
        // No data, redirect to home
        this.router.navigate(['/']);
        return;
      }
    }

    // Simulate loading
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1500);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  printResult() {
    window.print();
  }

  shareResult() {
    // TODO: Implement share functionality
    alert('Tính năng chia sẻ sẽ sớm được cập nhật!');
  }
}

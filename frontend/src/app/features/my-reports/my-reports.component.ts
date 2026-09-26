import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ReportService } from "@core/services/report.service";
import { Report, ReportStatus } from "@core/models/report.model";
import { StatusBadgeComponent } from "@shared/components/status-badge/status-badge.component";
import { CategoryBadgeComponent } from "@shared/components/category-badge/category-badge.component";
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component";
import { SkeletonComponent } from "@shared/components/skeleton/skeleton.component";
import { JalaliDatePipe } from "@shared/pipes/jalali-date.pipe";

@Component({
  selector: "app-my-reports",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    StatusBadgeComponent,
    CategoryBadgeComponent,
    EmptyStateComponent,
    SkeletonComponent,
    JalaliDatePipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-xl font-bold text-ink-primary mb-5">گزارش‌های من</h1>

      <div class="flex flex-wrap gap-1.5 mb-6">
        <button
          *ngFor="let opt of statusOptions"
          (click)="setStatus(opt.value)"
          class="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          [ngClass]="selectedStatus === opt.value ? 'bg-gradient-primary text-white' : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'"
        >
          {{ opt.label }}
        </button>
      </div>

      <div *ngIf="loading" class="grid gap-4 sm:grid-cols-2">
        <app-skeleton *ngFor="let i of [1,2,3,4]" height="120px" [rounded]="true"></app-skeleton>
      </div>

      <app-empty-state
        *ngIf="!loading && reports.length === 0"
        title="گزارشی ثبت نکرده‌اید"
        description="مشکلات شهری که مشاهده می‌کنید را ثبت کنید تا اینجا نمایش داده شوند."
      >
        <a routerLink="/report/new" class="btn-gradient mt-4 inline-block">ثبت گزارش جدید</a>
      </app-empty-state>

      <div *ngIf="!loading && reports.length" class="grid gap-4 sm:grid-cols-2">
        <a
          *ngFor="let r of reports; let i = index"
          [routerLink]="['/report', r.id]"
          class="card p-4 flex gap-3 stagger-item"
          [style.animation-delay.ms]="i * 40"
        >
          <img
            *ngIf="r.image"
            [src]="r.image"
            class="w-20 h-20 rounded-xl object-cover shrink-0"
          />
          <div
            *ngIf="!r.image"
            class="w-20 h-20 rounded-xl shrink-0 flex items-center justify-center"
            [ngStyle]="{ 'background-color': r.category.color + '1A' }"
          >
            <span class="w-3 h-3 rounded-full" [ngStyle]="{ 'background-color': r.category.color }"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-1.5">
              <app-category-badge [category]="r.category"></app-category-badge>
              <app-status-badge [status]="r.status" [label]="r.status_display"></app-status-badge>
            </div>
            <h3 class="font-medium text-ink-primary truncate">{{ r.title }}</h3>
            <p class="text-xs text-ink-secondary mt-1">{{ r.created_at | jalaliDate }}</p>
          </div>
        </a>
      </div>
    </div>
  `,
})
export class MyReportsComponent implements OnInit {
  reports: Report[] = [];
  loading = true;
  selectedStatus: ReportStatus | "" = "";

  statusOptions: { value: ReportStatus | ""; label: string }[] = [
    { value: "", label: "همه" },
    { value: "new", label: "جدید" },
    { value: "in_progress", label: "در حال بررسی" },
    { value: "done", label: "انجام‌شده" },
    { value: "rejected", label: "رد‌شده" },
  ];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.load();
  }

  setStatus(status: ReportStatus | ""): void {
    this.selectedStatus = status;
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.reportService
      .list({ status: this.selectedStatus, ordering: "-created_at", mine: true })
      .subscribe({
        next: (res) => {
          this.reports = res.results;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }
}

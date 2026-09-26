import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LucideAngularModule, MapPin } from "lucide-angular";
import { ReportService } from "@core/services/report.service";
import { ToastService } from "@core/services/toast.service";
import { AuthService } from "@core/services/auth.service";
import { Report } from "@core/models/report.model";
import { StatusBadgeComponent } from "@shared/components/status-badge/status-badge.component";
import { CategoryBadgeComponent } from "@shared/components/category-badge/category-badge.component";
import { SkeletonComponent } from "@shared/components/skeleton/skeleton.component";
import { JalaliDatePipe } from "@shared/pipes/jalali-date.pipe";
import { StatusTimelineComponent } from "./components/status-timeline/status-timeline.component";
import { CommentsSectionComponent } from "./components/comments-section/comments-section.component";
import { MiniMapComponent } from "./components/mini-map/mini-map.component";

@Component({
  selector: "app-report-detail",
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    StatusBadgeComponent,
    CategoryBadgeComponent,
    SkeletonComponent,
    JalaliDatePipe,
    StatusTimelineComponent,
    CommentsSectionComponent,
    MiniMapComponent,
  ],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div *ngIf="loading" class="flex flex-col gap-4">
        <app-skeleton height="220px" [rounded]="true"></app-skeleton>
        <app-skeleton height="24px" width="60%"></app-skeleton>
        <app-skeleton height="80px" [rounded]="true"></app-skeleton>
      </div>

      <div *ngIf="!loading && report" class="flex flex-col gap-6">
        <div class="card overflow-hidden stagger-item">
          <img
            *ngIf="report.image"
            [src]="report.image"
            class="w-full h-64 object-cover"
            [alt]="report.title"
          />
          <div class="p-5">
            <div class="flex items-center gap-2 mb-3">
              <app-category-badge [category]="report.category"></app-category-badge>
              <app-status-badge [status]="report.status" [label]="report.status_display"></app-status-badge>
            </div>
            <h1 class="text-xl font-bold text-ink-primary mb-2">{{ report.title }}</h1>
            <p class="text-ink-secondary text-sm leading-7">{{ report.description }}</p>

            <div class="flex items-center gap-1.5 text-xs text-ink-secondary mt-4">
              <lucide-icon [img]="PinIcon" [size]="14"></lucide-icon>
              {{ report.address || "بدون آدرس ثبت‌شده" }}
            </div>
            <div class="text-xs text-ink-secondary mt-1">
              ثبت‌شده در {{ report.created_at | jalaliDate: true }} توسط
              {{ report.user.first_name || report.user.username }}
            </div>
          </div>
        </div>

        <div *ngIf="auth.isOperatorOrAdmin()" class="card p-5 stagger-item">
          <h3 class="font-semibold text-ink-primary mb-3">تغییر وضعیت</h3>
          <div class="flex flex-wrap gap-2">
            <button
              *ngFor="let s of statusOptions"
              (click)="changeStatus(s.value)"
              [disabled]="report.status === s.value || updatingStatus"
              class="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              [ngClass]="report.status === s.value ? 'bg-gradient-primary text-white' : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'"
            >
              {{ s.label }}
            </button>
          </div>
        </div>

        <div class="card p-5 stagger-item">
          <h3 class="font-semibold text-ink-primary mb-4">موقعیت روی نقشه</h3>
          <app-mini-map [lat]="report.lat" [lng]="report.lng" [color]="report.category.color"></app-mini-map>
        </div>

        <div class="card p-5 stagger-item">
          <h3 class="font-semibold text-ink-primary mb-4">تاریخچه وضعیت</h3>
          <app-status-timeline [history]="report.status_history ?? []"></app-status-timeline>
        </div>

        <div class="card p-5 stagger-item">
          <h3 class="font-semibold text-ink-primary mb-4">نظرات</h3>
          <app-comments-section
            [comments]="report.comments ?? []"
            (addComment)="onAddComment($event)"
          ></app-comments-section>
        </div>
      </div>
    </div>
  `,
})
export class ReportDetailComponent implements OnInit {
  report: Report | null = null;
  loading = true;
  updatingStatus = false;
  readonly PinIcon = MapPin;

  statusOptions: { value: Report["status"]; label: string }[] = [
    { value: "new", label: "جدید" },
    { value: "in_progress", label: "در حال بررسی" },
    { value: "done", label: "انجام‌شده" },
    { value: "rejected", label: "رد‌شده" },
  ];

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.reportService.getById(id).subscribe({
      next: (report) => {
        this.report = report;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  changeStatus(status: Report["status"]): void {
    if (!this.report) return;
    this.updatingStatus = true;
    this.reportService.updateStatus(this.report.id, status).subscribe({
      next: (updated) => {
        this.report = updated;
        this.toast.success("وضعیت گزارش به‌روزرسانی شد.");
      },
      complete: () => (this.updatingStatus = false),
      error: () => (this.updatingStatus = false),
    });
  }

  onAddComment(text: string): void {
    if (!this.report) return;
    this.reportService.addComment(this.report.id, text).subscribe((comment) => {
      this.report!.comments = [...(this.report!.comments ?? []), comment];
    });
  }
}

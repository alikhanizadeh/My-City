import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { StatsService } from "@core/services/stats.service";
import { ReportService } from "@core/services/report.service";
import { ToastService } from "@core/services/toast.service";
import { Report, ReportStatus, StatsOverview } from "@core/models/report.model";
import { SkeletonComponent } from "@shared/components/skeleton/skeleton.component";
import { KpiCardsComponent } from "./components/kpi-cards/kpi-cards.component";
import { StatusDonutChartComponent } from "./components/status-donut-chart/status-donut-chart.component";
import { CategoryBarChartComponent } from "./components/category-bar-chart/category-bar-chart.component";
import { MonthlyTrendChartComponent } from "./components/monthly-trend-chart/monthly-trend-chart.component";
import { ReportsTableComponent } from "./components/reports-table/reports-table.component";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    SkeletonComponent,
    KpiCardsComponent,
    StatusDonutChartComponent,
    CategoryBarChartComponent,
    MonthlyTrendChartComponent,
    ReportsTableComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
      <h1 class="text-xl font-bold text-ink-primary">داشبورد مدیریت</h1>

      <div *ngIf="loadingStats" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <app-skeleton *ngFor="let i of [1,2,3,4]" height="100px" [rounded]="true"></app-skeleton>
      </div>
      <app-kpi-cards *ngIf="!loadingStats" [stats]="stats"></app-kpi-cards>

      <div class="grid md:grid-cols-2 gap-6">
        <app-status-donut-chart [stats]="stats"></app-status-donut-chart>
        <app-category-bar-chart [stats]="stats"></app-category-bar-chart>
      </div>

      <app-monthly-trend-chart [stats]="stats"></app-monthly-trend-chart>

      <div>
        <h2 class="font-semibold text-ink-primary mb-3">مدیریت گزارش‌ها</h2>
        <div *ngIf="loadingReports" class="flex flex-col gap-2">
          <app-skeleton *ngFor="let i of [1,2,3,4,5]" height="48px" [rounded]="true"></app-skeleton>
        </div>
        <app-reports-table
          *ngIf="!loadingReports"
          [reports]="reports"
          (statusChanged)="onStatusChanged($event)"
        ></app-reports-table>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  stats: StatsOverview | null = null;
  reports: Report[] = [];
  loadingStats = true;
  loadingReports = true;

  constructor(
    private statsService: StatsService,
    private reportService: ReportService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.statsService.overview().subscribe({
      next: (res) => (this.stats = res),
      complete: () => (this.loadingStats = false),
      error: () => (this.loadingStats = false),
    });

    this.loadReports();
  }

  onStatusChanged(event: { report: Report; status: ReportStatus }): void {
    this.reportService
      .updateStatus(event.report.id, event.status)
      .subscribe(() => {
        this.toast.success("وضعیت گزارش به‌روزرسانی شد.");
        this.loadReports();
      });
  }

  private loadReports(): void {
    this.loadingReports = true;
    this.reportService
      .list({ ordering: "-created_at", page_size: 50 })
      .subscribe({
        next: (res) => {
          this.reports = res.results;
          this.loadingReports = false;
        },
        error: () => (this.loadingReports = false),
      });
  }
}

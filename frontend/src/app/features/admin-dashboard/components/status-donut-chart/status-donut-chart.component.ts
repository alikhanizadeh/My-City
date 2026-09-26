import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges } from "@angular/core";
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  NgApexchartsModule,
} from "ng-apexcharts";
import { StatsOverview } from "@core/models/report.model";

const STATUS_LABELS: Record<string, string> = {
  new: "جدید",
  in_progress: "در حال بررسی",
  done: "انجام‌شده",
  rejected: "رد‌شده",
};

const STATUS_COLORS: Record<string, string> = {
  new: "#F59E0B",
  in_progress: "#3B82F6",
  done: "#10B981",
  rejected: "#EF4444",
};

@Component({
  selector: "app-status-donut-chart",
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="card p-5">
      <h3 class="font-semibold text-ink-primary mb-3">تفکیک وضعیت</h3>
      <apx-chart
        *ngIf="series.length"
        [series]="series"
        [chart]="chart"
        [labels]="labels"
        [colors]="colors"
        [dataLabels]="dataLabels"
        [legend]="legend"
      ></apx-chart>
    </div>
  `,
})
export class StatusDonutChartComponent implements OnChanges {
  @Input() stats: StatsOverview | null = null;

  series: number[] = [];
  labels: string[] = [];
  colors: string[] = [];

  chart: ApexChart = { type: "donut", height: 260, fontFamily: "Vazirmatn" };
  dataLabels: ApexDataLabels = { enabled: true };
  legend: ApexLegend = { position: "bottom", fontFamily: "Vazirmatn" };

  ngOnChanges(): void {
    if (!this.stats) return;
    this.series = this.stats.by_status.map((s) => s.count);
    this.labels = this.stats.by_status.map(
      (s) => STATUS_LABELS[s.status] ?? s.status
    );
    this.colors = this.stats.by_status.map(
      (s) => STATUS_COLORS[s.status] ?? "#94A3B8"
    );
  }
}

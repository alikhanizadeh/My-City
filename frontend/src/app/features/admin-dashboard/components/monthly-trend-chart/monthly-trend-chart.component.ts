import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexXAxis,
  NgApexchartsModule,
} from "ng-apexcharts";
import { StatsOverview } from "@core/models/report.model";

@Component({
  selector: "app-monthly-trend-chart",
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="card p-5">
      <h3 class="font-semibold text-ink-primary mb-3">روند ۶ ماه اخیر</h3>
      <apx-chart
        *ngIf="series.length"
        [series]="series"
        [chart]="chart"
        [xaxis]="xaxis"
        [stroke]="stroke"
        [colors]="colors"
      ></apx-chart>
    </div>
  `,
})
export class MonthlyTrendChartComponent implements OnChanges {
  @Input() stats: StatsOverview | null = null;

  series: ApexAxisChartSeries = [];
  xaxis: ApexXAxis = { categories: [] };
  colors = ["#2563EB"];

  chart: ApexChart = {
    type: "area",
    height: 280,
    fontFamily: "Vazirmatn",
    toolbar: { show: false },
  };
  stroke: ApexStroke = { curve: "smooth", width: 3 };

  ngOnChanges(): void {
    if (!this.stats) return;
    this.series = [
      {
        name: "گزارش‌ها",
        data: this.stats.monthly_trend.map((m) => m.count),
      },
    ];
    this.xaxis = {
      categories: this.stats.monthly_trend.map((m) => m.month),
      labels: { style: { fontFamily: "Vazirmatn" } },
    };
  }
}

import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  NgApexchartsModule,
} from "ng-apexcharts";
import { StatsOverview } from "@core/models/report.model";

@Component({
  selector: "app-category-bar-chart",
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="card p-5">
      <h3 class="font-semibold text-ink-primary mb-3">تفکیک دسته‌بندی</h3>
      <apx-chart
        *ngIf="series.length"
        [series]="series"
        [chart]="chart"
        [xaxis]="xaxis"
        [colors]="colors"
        [plotOptions]="plotOptions"
        [dataLabels]="dataLabels"
      ></apx-chart>
    </div>
  `,
})
export class CategoryBarChartComponent implements OnChanges {
  @Input() stats: StatsOverview | null = null;

  series: ApexAxisChartSeries = [];
  xaxis: ApexXAxis = { categories: [] };
  colors: string[] = [];

  chart: ApexChart = { type: "bar", height: 280, fontFamily: "Vazirmatn" };
  plotOptions: ApexPlotOptions = {
    bar: { borderRadius: 6, distributed: true, horizontal: false },
  };
  dataLabels: ApexDataLabels = { enabled: false };

  ngOnChanges(): void {
    if (!this.stats) return;
    this.series = [
      { name: "تعداد", data: this.stats.by_category.map((c) => c.count) },
    ];
    this.xaxis = {
      categories: this.stats.by_category.map((c) => c.category__name),
      labels: { style: { fontFamily: "Vazirmatn" } },
    };
    this.colors = this.stats.by_category.map((c) => c.category__color);
  }
}

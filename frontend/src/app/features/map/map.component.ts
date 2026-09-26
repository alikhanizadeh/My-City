import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  LucideAngularModule,
  LocateFixed,
  PlusCircle,
  RefreshCw,
} from "lucide-angular";
import { CategoryService } from "@core/services/category.service";
import { ReportService } from "@core/services/report.service";
import { ToastService } from "@core/services/toast.service";
import { Category } from "@core/models/category.model";
import { ReportFilters } from "@core/models/report.model";
import { environment } from "@env/environment";
import {
  LeafletMapService,
  TileLayerKey,
} from "./services/leaflet-map.service";
import { MapSidebarFiltersComponent } from "./components/map-sidebar-filters/map-sidebar-filters.component";
import { BottomSheetFiltersComponent } from "./components/bottom-sheet-filters/bottom-sheet-filters.component";

@Component({
  selector: "app-map",
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    MapSidebarFiltersComponent,
    BottomSheetFiltersComponent,
  ],
  template: `
    <div class="relative w-full" style="height: calc(100vh - 4rem);">
      <div id="city-map" class="absolute inset-0 z-0"></div>

      <div class="hidden md:block absolute top-4 right-4 z-[500]">
        <app-map-sidebar-filters
          [categories]="categories"
          [filters]="filters"
          [heatmapOn]="heatmapOn"
          (filtersChange)="onFiltersChange($event)"
          (heatmapToggled)="onHeatmapToggle($event)"
          (switchTile)="onSwitchTile()"
        ></app-map-sidebar-filters>
      </div>

      <app-bottom-sheet-filters
        [categories]="categories"
        [filters]="filters"
        [heatmapOn]="heatmapOn"
        (filtersChange)="onFiltersChange($event)"
        (heatmapToggled)="onHeatmapToggle($event)"
        (switchTile)="onSwitchTile()"
      ></app-bottom-sheet-filters>

      <!-- بنر خطای بارگذاری گزارش‌ها -->
      <div
        *ngIf="reportsError"
        class="absolute top-4 left-1/2 -translate-x-1/2 z-[600] bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-soft-hover"
      >
        <span>بارگذاری گزارش‌ها با مشکل مواجه شد.</span>
        <button
          (click)="loadReports()"
          class="flex items-center gap-1 font-medium underline underline-offset-2"
        >
          <lucide-icon [img]="RefreshIcon" [size]="14"></lucide-icon>
          تلاش مجدد
        </button>
      </div>

      <button
        (click)="locateMe()"
        class="absolute bottom-6 left-4 md:bottom-6 md:left-6 z-[500] w-12 h-12 rounded-full bg-white shadow-soft-hover flex items-center justify-center hover:scale-105 transition-transform"
        title="موقعیت من"
      >
        <lucide-icon
          [img]="LocateIcon"
          [size]="20"
          class="text-primary-from"
        ></lucide-icon>
      </button>

      <button
        (click)="goToNewReport()"
        class="absolute bottom-6 right-4 md:bottom-6 md:right-6 z-[500] btn-gradient flex items-center gap-2 !rounded-full !px-5 !py-3"
      >
        <lucide-icon [img]="PlusIcon" [size]="18"></lucide-icon>
        ثبت گزارش
      </button>
    </div>
  `,
})
export class MapComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  filters: ReportFilters = { status: "", category: "" };
  heatmapOn = false;
  reportsError = false;
  private currentTile: TileLayerKey = "voyager";

  readonly LocateIcon = LocateFixed;
  readonly PlusIcon = PlusCircle;
  readonly RefreshIcon = RefreshCw;

  constructor(
    private leaflet: LeafletMapService,
    private categoryService: CategoryService,
    private reportService: ReportService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.leaflet.init(
      "city-map",
      [environment.defaultMapCenter.lat, environment.defaultMapCenter.lng],
      environment.defaultMapZoom,
    );

    // اطلاع‌رسانی وقتی منبع تایل به‌صورت خودکار (fallback) عوض می‌شود
    this.leaflet.setTileFallbackListener((key, allFailed) => {
      if (allFailed) {
        this.toast.error(
          "نقشه پایه در دسترس نیست، اما گزارش‌ها همچنان قابل مشاهده‌اند.",
        );
      } else {
        this.toast.info("نقشه پایه به منبع جایگزین سوییچ شد.");
      }
    });

    this.categoryService.list().subscribe((cats) => (this.categories = cats));

    this.loadReports();

    this.leaflet.onMoveEnd(() => this.loadReports());
  }

  ngOnDestroy(): void {
    this.leaflet.destroy();
  }

  onFiltersChange(filters: ReportFilters): void {
    this.filters = filters;
    this.loadReports();
  }

  onHeatmapToggle(show: boolean): void {
    this.heatmapOn = show;
    if (show) {
      this.reportService
        .heatmap()
        .subscribe((points) => this.leaflet.toggleHeatmap(points, true));
    } else {
      this.leaflet.toggleHeatmap([], false);
    }
  }

  onSwitchTile(): void {
    const order: TileLayerKey[] = ["voyager", "positron", "osm"];
    const idx = (order.indexOf(this.currentTile) + 1) % order.length;
    this.currentTile = order[idx];
    this.leaflet.switchTileLayer(this.currentTile);
  }

  locateMe(): void {
    this.leaflet.locateUser().catch((message) => alert(message));
  }

  goToNewReport(): void {
    this.router.navigate(["/report/new"]);
  }

  loadReports(): void {
    this.reportsError = false;
    const bounds = this.leaflet.getBounds();
    const bbox = bounds
      ? `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`
      : undefined;

    this.reportService
      .list({ ...this.filters, bbox, page_size: 500 })
      .subscribe({
        next: (res) => {
          this.leaflet.setMarkers(res.results, (id) =>
            this.router.navigate(["/report", id]),
          );
        },
        error: () => {
          this.reportsError = true;
        },
      });
  }
}

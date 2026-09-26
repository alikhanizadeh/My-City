import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LucideAngularModule, SlidersHorizontal, X } from "lucide-angular";
import { MapSidebarFiltersComponent } from "../map-sidebar-filters/map-sidebar-filters.component";
import { Category } from "@core/models/category.model";
import { ReportFilters } from "@core/models/report.model";

@Component({
  selector: "app-bottom-sheet-filters",
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MapSidebarFiltersComponent],
  template: `
    <button
      (click)="open = true"
      class="md:hidden fixed bottom-24 left-4 z-[500] w-12 h-12 rounded-full bg-white shadow-soft-hover flex items-center justify-center"
    >
      <lucide-icon [img]="SlidersIcon" [size]="20" class="text-primary-from"></lucide-icon>
    </button>

    <div *ngIf="open" class="md:hidden fixed inset-0 z-[1000]">
      <div class="absolute inset-0 bg-slate-900/40" (click)="open = false"></div>
      <div class="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-4 pb-8 max-h-[80vh] overflow-y-auto stagger-item">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">فیلترها</h3>
          <button (click)="open = false" class="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </div>
        <app-map-sidebar-filters
          [categories]="categories"
          [filters]="filters"
          [heatmapOn]="heatmapOn"
          (filtersChange)="filtersChange.emit($event)"
          (heatmapToggled)="heatmapToggled.emit($event)"
          (switchTile)="switchTile.emit()"
          class="!w-full !max-h-none"
        ></app-map-sidebar-filters>
      </div>
    </div>
  `,
})
export class BottomSheetFiltersComponent {
  @Input() categories: Category[] = [];
  @Input() filters: ReportFilters = {};
  @Input() heatmapOn = false;
  @Output() filtersChange = new EventEmitter<ReportFilters>();
  @Output() heatmapToggled = new EventEmitter<boolean>();
  @Output() switchTile = new EventEmitter<void>();

  open = false;
  readonly SlidersIcon = SlidersHorizontal;
  readonly XIcon = X;
}

import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, Flame, Layers, Search } from "lucide-angular";
import { Category } from "@core/models/category.model";
import { ReportFilters, ReportStatus } from "@core/models/report.model";

@Component({
  selector: "app-map-sidebar-filters",
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="card p-4 w-80 flex flex-col gap-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div class="relative">
        <lucide-icon [img]="SearchIcon" [size]="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary"></lucide-icon>
        <input
          type="text"
          class="input-field pr-9"
          placeholder="جستجو در گزارش‌ها..."
          [(ngModel)]="filters.search"
          (ngModelChange)="emitChange()"
        />
      </div>

      <div>
        <label class="text-xs font-medium text-ink-secondary mb-1.5 block">وضعیت</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            *ngFor="let opt of statusOptions"
            (click)="setStatus(opt.value)"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            [ngClass]="filters.status === opt.value ? 'bg-gradient-primary text-white' : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div>
        <label class="text-xs font-medium text-ink-secondary mb-1.5 block">دسته‌بندی</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            (click)="setCategory('')"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            [ngClass]="!filters.category ? 'bg-gradient-primary text-white' : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'"
          >
            همه
          </button>
          <button
            *ngFor="let cat of categories"
            (click)="setCategory(cat.id)"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            [ngStyle]="filters.category === cat.id ? { 'background-color': cat.color, color: 'white' } : {}"
            [ngClass]="filters.category !== cat.id ? 'bg-slate-100 text-ink-secondary hover:bg-slate-200' : ''"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-4 flex flex-col gap-3">
        <button
          (click)="heatmapToggled.emit(!heatmapOn); "
          class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span class="flex items-center gap-2 text-sm text-ink-primary">
            <lucide-icon [img]="FlameIcon" [size]="16"></lucide-icon>
            نمایش نقشه حرارتی
          </span>
          <span
            class="w-9 h-5 rounded-full relative transition-colors"
            [ngClass]="heatmapOn ? 'bg-gradient-primary' : 'bg-slate-300'"
          >
            <span
              class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
              [ngClass]="heatmapOn ? 'right-0.5' : 'right-4'"
            ></span>
          </span>
        </button>

        <button
          (click)="switchTile.emit()"
          class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-sm text-ink-primary"
        >
          <lucide-icon [img]="LayersIcon" [size]="16"></lucide-icon>
          تغییر نوع نقشه
        </button>
      </div>
    </div>
  `,
})
export class MapSidebarFiltersComponent {
  @Input() categories: Category[] = [];
  @Input() filters: ReportFilters = {};
  @Input() heatmapOn = false;
  @Output() filtersChange = new EventEmitter<ReportFilters>();
  @Output() heatmapToggled = new EventEmitter<boolean>();
  @Output() switchTile = new EventEmitter<void>();

  readonly SearchIcon = Search;
  readonly FlameIcon = Flame;
  readonly LayersIcon = Layers;

  statusOptions: { value: ReportStatus | ""; label: string }[] = [
    { value: "", label: "همه" },
    { value: "new", label: "جدید" },
    { value: "in_progress", label: "در حال بررسی" },
    { value: "done", label: "انجام‌شده" },
    { value: "rejected", label: "رد‌شده" },
  ];

  setStatus(value: ReportStatus | ""): void {
    this.filters.status = value;
    this.emitChange();
  }

  setCategory(value: number | ""): void {
    this.filters.category = value;
    this.emitChange();
  }

  emitChange(): void {
    this.filtersChange.emit({ ...this.filters });
  }
}

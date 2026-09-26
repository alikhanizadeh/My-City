import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Category } from "@core/models/category.model";
import { ReportPriority } from "@core/models/report.model";

@Component({
  selector: "app-step-review",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-lg font-semibold text-ink-primary mb-4">بازبینی و ارسال</h2>

    <div class="card p-4 flex flex-col gap-3">
      <div *ngIf="previewUrl" class="rounded-xl overflow-hidden h-40">
        <img [src]="previewUrl" class="w-full h-full object-cover" />
      </div>

      <div class="flex items-center gap-2">
        <span
          class="w-3 h-3 rounded-full"
          [ngStyle]="{ 'background-color': category?.color }"
        ></span>
        <span class="text-sm font-medium">{{ category?.name }}</span>
        <span
          class="mr-auto text-xs px-2 py-0.5 rounded-full bg-slate-100 text-ink-secondary"
        >
          اولویت: {{ priorityLabel }}
        </span>
      </div>

      <h3 class="font-semibold text-ink-primary">{{ title || "—" }}</h3>
      <p class="text-sm text-ink-secondary">{{ description || "—" }}</p>

      <div class="border-t border-slate-100 pt-3 text-sm text-ink-secondary">
        <div class="mb-1">📍 {{ address || "آدرس ثبت نشده" }}</div>
        <div *ngIf="lat && lng">مختصات: {{ lat | number: "1.5-5" }}, {{ lng | number: "1.5-5" }}</div>
      </div>
    </div>

    <button
      (click)="submit.emit()"
      [disabled]="submitting"
      class="btn-gradient w-full mt-5"
    >
      {{ submitting ? "در حال ارسال..." : "ارسال گزارش" }}
    </button>
  `,
})
export class StepReviewComponent {
  @Input() category: Category | null = null;
  @Input() title = "";
  @Input() description = "";
  @Input() priority: ReportPriority = "medium";
  @Input() address = "";
  @Input() lat: number | null = null;
  @Input() lng: number | null = null;
  @Input() previewUrl: string | null = null;
  @Input() submitting = false;
  @Output() submit = new EventEmitter<void>();

  get priorityLabel(): string {
    return { low: "کم", medium: "متوسط", high: "زیاد" }[this.priority];
  }
}

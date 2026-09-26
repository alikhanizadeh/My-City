import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, ImagePlus, X } from "lucide-angular";
import { ReportPriority } from "@core/models/report.model";

@Component({
  selector: "app-step-details",
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <h2 class="text-lg font-semibold text-ink-primary mb-4">جزئیات مشکل را وارد کنید</h2>

    <div class="flex flex-col gap-4">
      <div>
        <label class="text-xs font-medium text-ink-secondary mb-1 block">عنوان</label>
        <input class="input-field" [ngModel]="title" (ngModelChange)="titleChange.emit($event)" placeholder="مثلاً: چاله بزرگ در وسط خیابان" />
      </div>

      <div>
        <label class="text-xs font-medium text-ink-secondary mb-1 block">توضیحات</label>
        <textarea
          class="input-field min-h-[100px]"
          [ngModel]="description"
          (ngModelChange)="descriptionChange.emit($event)"
          placeholder="جزئیات بیشتر درباره مشکل..."
        ></textarea>
      </div>

      <div>
        <label class="text-xs font-medium text-ink-secondary mb-1.5 block">اولویت</label>
        <div class="flex gap-2">
          <button
            *ngFor="let p of priorities"
            (click)="priorityChange.emit(p.value)"
            class="flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200"
            [ngClass]="priority === p.value ? 'border-primary-from bg-primary-from/10 text-primary-from' : 'border-slate-200 text-ink-secondary'"
          >
            {{ p.label }}
          </button>
        </div>
      </div>

      <div>
        <label class="text-xs font-medium text-ink-secondary mb-1.5 block">عکس (اختیاری - حداکثر ۵ مگابایت)</label>

        <div *ngIf="!previewUrl" class="border-2 border-dashed border-slate-200 rounded-card p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary-from/50 transition-colors" (click)="fileInput.click()">
          <lucide-icon [img]="ImageIcon" [size]="28" class="text-ink-secondary"></lucide-icon>
          <span class="text-sm text-ink-secondary">برای آپلود عکس کلیک کنید</span>
        </div>

        <div *ngIf="previewUrl" class="relative rounded-card overflow-hidden">
          <img [src]="previewUrl" class="w-full h-48 object-cover" />
          <button (click)="removeImage()" class="absolute top-2 left-2 w-8 h-8 rounded-full bg-slate-900/60 text-white flex items-center justify-center">
            <lucide-icon [img]="XIcon" [size]="16"></lucide-icon>
          </button>
        </div>

        <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onFileSelected($event)" />
      </div>
    </div>
  `,
})
export class StepDetailsComponent {
  @Input() title = "";
  @Input() description = "";
  @Input() priority: ReportPriority = "medium";
  @Input() previewUrl: string | null = null;

  @Output() titleChange = new EventEmitter<string>();
  @Output() descriptionChange = new EventEmitter<string>();
  @Output() priorityChange = new EventEmitter<ReportPriority>();
  @Output() imageSelected = new EventEmitter<File | null>();

  readonly ImageIcon = ImagePlus;
  readonly XIcon = X;

  priorities: { value: ReportPriority; label: string }[] = [
    { value: "low", label: "کم" },
    { value: "medium", label: "متوسط" },
    { value: "high", label: "زیاد" },
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      alert("حجم عکس نباید بیشتر از ۵ مگابایت باشد.");
      return;
    }
    this.imageSelected.emit(file);
  }

  removeImage(): void {
    this.imageSelected.emit(null);
  }
}

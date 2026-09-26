import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Category } from "@core/models/category.model";

@Component({
  selector: "app-step-category",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-lg font-semibold text-ink-primary mb-4">مشکل از چه نوعی است؟</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        *ngFor="let cat of categories"
        (click)="select.emit(cat.id)"
        class="card p-4 flex flex-col items-center gap-2 border-2 transition-all duration-200 hover:scale-[1.03]"
        [ngClass]="selectedId === cat.id ? 'border-primary-from' : 'border-transparent'"
      >
        <span
          class="w-11 h-11 rounded-xl flex items-center justify-center"
          [ngStyle]="{ 'background-color': cat.color + '1A' }"
        >
          <span class="w-4 h-4 rounded-full" [ngStyle]="{ 'background-color': cat.color }"></span>
        </span>
        <span class="text-sm font-medium text-ink-primary">{{ cat.name }}</span>
      </button>
    </div>
  `,
})
export class StepCategoryComponent {
  @Input() categories: Category[] = [];
  @Input() selectedId: number | null = null;
  @Output() select = new EventEmitter<number>();
}

import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Category } from "@core/models/category.model";

@Component({
  selector: "app-category-badge",
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      [ngStyle]="{
        'background-color': category.color + '1A',
        color: category.color
      }"
    >
      <span class="w-1.5 h-1.5 rounded-full" [ngStyle]="{ 'background-color': category.color }"></span>
      {{ category.name }}
    </span>
  `,
})
export class CategoryBadgeComponent {
  @Input({ required: true }) category!: Category;
}

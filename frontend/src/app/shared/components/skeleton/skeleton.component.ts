import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-skeleton",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse" [ngStyle]="{ width: width, height: height }">
      <div class="bg-slate-200/80 w-full h-full" [class]="rounded ? 'rounded-card' : 'rounded-md'"></div>
    </div>
  `,
})
export class SkeletonComponent {
  @Input() width = "100%";
  @Input() height = "16px";
  @Input() rounded = false;
}

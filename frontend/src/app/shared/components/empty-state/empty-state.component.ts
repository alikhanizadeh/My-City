import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { LucideAngularModule, Inbox } from "lucide-angular";

@Component({
  selector: "app-empty-state",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-16 px-4 stagger-item">
      <div class="w-20 h-20 rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4">
        <lucide-icon [img]="InboxIcon" [size]="36" class="text-primary-from"></lucide-icon>
      </div>
      <h3 class="text-lg font-semibold text-ink-primary mb-1">{{ title }}</h3>
      <p class="text-ink-secondary text-sm max-w-xs">{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = "چیزی یافت نشد";
  @Input() description = "در حال حاضر موردی برای نمایش وجود ندارد.";
  readonly InboxIcon = Inbox;
}

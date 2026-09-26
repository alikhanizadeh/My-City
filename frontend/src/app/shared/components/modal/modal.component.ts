import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LucideAngularModule, X } from "lucide-angular";

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      *ngIf="open"
      class="fixed inset-0 z-[999] flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-up"
        (click)="close.emit()"
      ></div>
      <div
        class="relative bg-white rounded-card shadow-soft-hover w-full max-w-lg max-h-[85vh] overflow-y-auto stagger-item"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 class="font-semibold text-ink-primary">{{ title }}</h3>
          <button (click)="close.emit()" class="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
            <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
          </button>
        </div>
        <div class="p-6">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = "";
  @Output() close = new EventEmitter<void>();
  readonly XIcon = X;
}

import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { LucideAngularModule, CheckCircle2, XCircle, Info, X } from "lucide-angular";
import { ToastService } from "@core/services/toast.service";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[90%] max-w-sm">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="stagger-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-soft-hover text-sm font-medium"
        [ngClass]="{
          'bg-emerald-50 text-emerald-700 border border-emerald-200': toast.type === 'success',
          'bg-red-50 text-red-700 border border-red-200': toast.type === 'error',
          'bg-blue-50 text-blue-700 border border-blue-200': toast.type === 'info'
        }"
      >
        <lucide-icon [img]="toast.type === 'success' ? CheckIcon : toast.type === 'error' ? XCircleIcon : InfoIcon" [size]="18"></lucide-icon>
        <span class="flex-1">{{ toast.text }}</span>
        <button (click)="toastService.dismiss(toast.id)" class="opacity-60 hover:opacity-100">
          <lucide-icon [img]="XIcon" [size]="16"></lucide-icon>
        </button>
      </div>
    </div>
  `,
})
export class ToastComponent {
  readonly CheckIcon = CheckCircle2;
  readonly XCircleIcon = XCircle;
  readonly InfoIcon = Info;
  readonly XIcon = X;

  constructor(public toastService: ToastService) {}
}

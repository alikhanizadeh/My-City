import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ReportStatus } from "@core/models/report.model";

const STATUS_STYLES: Record<ReportStatus, { bg: string; text: string }> = {
  new: { bg: "bg-amber-50", text: "text-amber-600" },
  in_progress: { bg: "bg-blue-50", text: "text-blue-600" },
  done: { bg: "bg-emerald-50", text: "text-emerald-600" },
  rejected: { bg: "bg-red-50", text: "text-red-600" },
};

@Component({
  selector: "app-status-badge",
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      [ngClass]="[style.bg, style.text]"
    >
      {{ label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: ReportStatus = "new";
  @Input() label = "";

  get style() {
    return STATUS_STYLES[this.status] ?? STATUS_STYLES["new"];
  }
}

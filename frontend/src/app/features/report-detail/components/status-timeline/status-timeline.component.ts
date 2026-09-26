import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ReportStatusHistoryItem } from "@core/models/report.model";
import { JalaliDatePipe } from "@shared/pipes/jalali-date.pipe";

const STATUS_COLORS: Record<string, string> = {
  new: "#F59E0B",
  in_progress: "#3B82F6",
  done: "#10B981",
  rejected: "#EF4444",
};

@Component({
  selector: "app-status-timeline",
  standalone: true,
  imports: [CommonModule, JalaliDatePipe],
  template: `
    <div class="flex flex-col">
      <div *ngFor="let item of history; let last = last" class="flex gap-3">
        <div class="flex flex-col items-center">
          <span
            class="w-3 h-3 rounded-full mt-1.5 shrink-0"
            [ngStyle]="{ 'background-color': STATUS_COLORS[item.new_status] }"
          ></span>
          <span *ngIf="!last" class="w-px flex-1 bg-slate-200 my-1"></span>
        </div>
        <div class="pb-5">
          <p class="text-sm font-medium text-ink-primary">
            {{ item.new_status_display }}
            <span *ngIf="item.old_status" class="text-ink-secondary font-normal">
              (از {{ item.old_status_display }})
            </span>
          </p>
          <p *ngIf="item.note" class="text-sm text-ink-secondary mt-0.5">{{ item.note }}</p>
          <p class="text-xs text-ink-secondary mt-1">
            {{ item.created_at | jalaliDate: true }}
            <span *ngIf="item.changed_by"> — {{ item.changed_by.first_name || item.changed_by.username }}</span>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class StatusTimelineComponent {
  @Input() history: ReportStatusHistoryItem[] = [];
  readonly STATUS_COLORS = STATUS_COLORS;
}

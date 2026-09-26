import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Report, ReportStatus } from "@core/models/report.model";
import { CategoryBadgeComponent } from "@shared/components/category-badge/category-badge.component";
import { JalaliDatePipe } from "@shared/pipes/jalali-date.pipe";

@Component({
  selector: "app-reports-table",
  standalone: true,
  imports: [CommonModule, RouterLink, CategoryBadgeComponent, JalaliDatePipe],
  template: `
    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-right text-ink-secondary border-b border-slate-100">
            <th class="px-4 py-3 font-medium">عنوان</th>
            <th class="px-4 py-3 font-medium">دسته</th>
            <th class="px-4 py-3 font-medium">شهروند</th>
            <th class="px-4 py-3 font-medium">تاریخ</th>
            <th class="px-4 py-3 font-medium">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let r of reports"
            class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
          >
            <td class="px-4 py-3">
              <a [routerLink]="['/report', r.id]" class="font-medium text-ink-primary hover:text-primary-from">
                {{ r.title }}
              </a>
            </td>
            <td class="px-4 py-3">
              <app-category-badge [category]="r.category"></app-category-badge>
            </td>
            <td class="px-4 py-3 text-ink-secondary">{{ r.user.first_name || r.user.username }}</td>
            <td class="px-4 py-3 text-ink-secondary">{{ r.created_at | jalaliDate }}</td>
            <td class="px-4 py-3">
              <select
                class="text-xs rounded-lg border border-slate-200 px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-from/30"
                [value]="r.status"
                (change)="onStatusChange(r, $any($event.target).value)"
              >
                <option value="new">جدید</option>
                <option value="in_progress">در حال بررسی</option>
                <option value="done">انجام‌شده</option>
                <option value="rejected">رد‌شده</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class ReportsTableComponent {
  @Input() reports: Report[] = [];
  @Output() statusChanged = new EventEmitter<{
    report: Report;
    status: ReportStatus;
  }>();

  onStatusChange(report: Report, status: ReportStatus): void {
    this.statusChanged.emit({ report, status });
  }
}

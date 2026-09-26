import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { LucideAngularModule, CheckCircle2, Clock, FileWarning, ListChecks } from "lucide-angular";
import { StatsOverview } from "@core/models/report.model";

@Component({
  selector: "app-kpi-cards",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-5 stagger-item">
        <div class="w-10 h-10 rounded-xl bg-primary-from/10 flex items-center justify-center mb-3">
          <lucide-icon [img]="ListIcon" [size]="18" class="text-primary-from"></lucide-icon>
        </div>
        <div class="text-2xl font-bold text-ink-primary">{{ stats?.total ?? 0 }}</div>
        <div class="text-xs text-ink-secondary mt-1">کل گزارش‌ها</div>
      </div>

      <div class="card p-5 stagger-item" style="animation-delay:.05s">
        <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
          <lucide-icon [img]="ClockIcon" [size]="18" class="text-amber-500"></lucide-icon>
        </div>
        <div class="text-2xl font-bold text-ink-primary">{{ count('new') }}</div>
        <div class="text-xs text-ink-secondary mt-1">جدید</div>
      </div>

      <div class="card p-5 stagger-item" style="animation-delay:.1s">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
          <lucide-icon [img]="CheckIcon" [size]="18" class="text-emerald-500"></lucide-icon>
        </div>
        <div class="text-2xl font-bold text-ink-primary">{{ count('done') }}</div>
        <div class="text-xs text-ink-secondary mt-1">انجام‌شده</div>
      </div>

      <div class="card p-5 stagger-item" style="animation-delay:.15s">
        <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
          <lucide-icon [img]="WarningIcon" [size]="18" class="text-red-500"></lucide-icon>
        </div>
        <div class="text-2xl font-bold text-ink-primary">{{ count('rejected') }}</div>
        <div class="text-xs text-ink-secondary mt-1">رد‌شده</div>
      </div>
    </div>
  `,
})
export class KpiCardsComponent {
  @Input() stats: StatsOverview | null = null;
  readonly ListIcon = ListChecks;
  readonly ClockIcon = Clock;
  readonly CheckIcon = CheckCircle2;
  readonly WarningIcon = FileWarning;

  count(status: string): number {
    return (
      this.stats?.by_status.find((s) => s.status === status)?.count ?? 0
    );
  }
}

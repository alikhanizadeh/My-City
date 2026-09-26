import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LucideAngularModule, MapPin, TrendingUp, Users, Zap } from "lucide-angular";
import { StatsService } from "@core/services/stats.service";
import { StatsOverview } from "@core/models/report.model";

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <section class="relative overflow-hidden bg-gradient-primary">
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 20% 20%, white 0%, transparent 40%);"></div>
      <div class="max-w-6xl mx-auto px-6 py-20 md:py-28 relative text-center text-white">
        <h1 class="text-3xl md:text-5xl font-extrabold mb-4 stagger-item">
          شهر خودت را بهتر کن
        </h1>
        <p class="text-white/90 max-w-xl mx-auto mb-8 stagger-item" style="animation-delay: .1s">
          مشکلات شهری را همراه با عکس و موقعیت دقیق ثبت کن و وضعیت پیگیری‌اش را زنده ببین.
        </p>
        <div class="flex items-center justify-center gap-3 stagger-item" style="animation-delay: .2s">
          <a routerLink="/report/new" class="bg-white text-primary font-semibold rounded-xl px-6 py-3 shadow-soft-hover hover:scale-105 transition-transform">
            ثبت گزارش جدید
          </a>
          <a routerLink="/map" class="border border-white/40 text-white rounded-xl px-6 py-3 hover:bg-white/10 transition-colors">
            مشاهده نقشه
          </a>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 -mt-10 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-5 text-center stagger-item">
        <lucide-icon [img]="MapIcon" [size]="22" class="text-primary-from mx-auto mb-2"></lucide-icon>
        <div class="text-2xl font-bold">{{ stats?.total ?? '—' }}</div>
        <div class="text-xs text-ink-secondary mt-1">کل گزارش‌ها</div>
      </div>
      <div class="card p-5 text-center stagger-item" style="animation-delay:.05s">
        <lucide-icon [img]="ZapIcon" [size]="22" class="text-emerald-500 mx-auto mb-2"></lucide-icon>
        <div class="text-2xl font-bold">{{ doneCount ?? '—' }}</div>
        <div class="text-xs text-ink-secondary mt-1">انجام‌شده</div>
      </div>
      <div class="card p-5 text-center stagger-item" style="animation-delay:.1s">
        <lucide-icon [img]="TrendIcon" [size]="22" class="text-amber-500 mx-auto mb-2"></lucide-icon>
        <div class="text-2xl font-bold">{{ stats?.total_categories ?? '—' }}</div>
        <div class="text-xs text-ink-secondary mt-1">دسته‌بندی</div>
      </div>
      <div class="card p-5 text-center stagger-item" style="animation-delay:.15s">
        <lucide-icon [img]="UsersIcon" [size]="22" class="text-blue-500 mx-auto mb-2"></lucide-icon>
        <div class="text-2xl font-bold">{{ stats?.top_areas?.length ?? '—' }}</div>
        <div class="text-xs text-ink-secondary mt-1">مناطق فعال</div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 py-16">
      <div class="card overflow-hidden">
        <div class="h-72 md:h-96 bg-slate-100 flex items-center justify-center text-ink-secondary text-sm">
          پیش‌نمایش نقشه — برای مشاهده کامل روی «مشاهده نقشه» کلیک کنید
        </div>
      </div>
    </section>
  `,
})
export class LandingComponent implements OnInit {
  stats: StatsOverview | null = null;
  readonly MapIcon = MapPin;
  readonly ZapIcon = Zap;
  readonly TrendIcon = TrendingUp;
  readonly UsersIcon = Users;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.overview().subscribe((res) => (this.stats = res));
  }

  get doneCount(): number | null {
    return (
      this.stats?.by_status.find((s) => s.status === "done")?.count ?? null
    );
  }
}

import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { LucideAngularModule, Map, Menu, PlusCircle, User, X } from "lucide-angular";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="glass-nav sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2 font-bold text-lg text-ink-primary">
          <span class="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
            <lucide-icon [img]="MapIcon" class="text-white" [size]="20"></lucide-icon>
          </span>
          شهر من
        </a>

        <div class="hidden md:flex items-center gap-1">
          <a routerLink="/map" routerLinkActive="text-primary bg-primary-from/10" class="px-4 py-2 rounded-xl text-ink-secondary hover:bg-slate-100 transition-colors">نقشه</a>
          <a *ngIf="auth.isAuthenticated()" routerLink="/my-reports" routerLinkActive="text-primary bg-primary-from/10" class="px-4 py-2 rounded-xl text-ink-secondary hover:bg-slate-100 transition-colors">گزارش‌های من</a>
          <a *ngIf="auth.isOperatorOrAdmin()" routerLink="/admin" routerLinkActive="text-primary bg-primary-from/10" class="px-4 py-2 rounded-xl text-ink-secondary hover:bg-slate-100 transition-colors">داشبورد</a>
        </div>

        <div class="flex items-center gap-3">
          <a routerLink="/report/new" class="btn-gradient hidden sm:flex items-center gap-1.5 !py-2">
            <lucide-icon [img]="PlusCircleIcon" [size]="18"></lucide-icon>
            ثبت گزارش
          </a>

          <ng-container *ngIf="!auth.isAuthenticated(); else profile">
            <a routerLink="/login" class="btn-outline !py-2">ورود</a>
          </ng-container>
          <ng-template #profile>
            <button (click)="auth.logout()" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-ink-secondary hover:bg-slate-200 transition-colors">
              <lucide-icon [img]="UserIcon" [size]="18"></lucide-icon>
            </button>
          </ng-template>

          <button class="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100" (click)="mobileOpen = !mobileOpen">
            <lucide-icon [img]="mobileOpen ? XIcon : MenuIcon" [size]="22"></lucide-icon>
          </button>
        </div>
      </div>

      <div *ngIf="mobileOpen" class="md:hidden px-4 pb-4 flex flex-col gap-1 stagger-item">
        <a routerLink="/map" (click)="mobileOpen=false" class="px-4 py-2.5 rounded-xl hover:bg-slate-100">نقشه</a>
        <a *ngIf="auth.isAuthenticated()" routerLink="/my-reports" (click)="mobileOpen=false" class="px-4 py-2.5 rounded-xl hover:bg-slate-100">گزارش‌های من</a>
        <a *ngIf="auth.isOperatorOrAdmin()" routerLink="/admin" (click)="mobileOpen=false" class="px-4 py-2.5 rounded-xl hover:bg-slate-100">داشبورد</a>
        <a routerLink="/report/new" (click)="mobileOpen=false" class="px-4 py-2.5 rounded-xl bg-gradient-primary text-white text-center mt-1">ثبت گزارش</a>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  mobileOpen = false;
  readonly MapIcon = Map;
  readonly PlusCircleIcon = PlusCircle;
  readonly UserIcon = User;
  readonly MenuIcon = Menu;
  readonly XIcon = X;

  constructor(public auth: AuthService) {}
}

import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { ToastService } from "@core/services/toast.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="card w-full max-w-sm p-8 stagger-item">
        <h1 class="text-xl font-bold text-ink-primary mb-1">خوش آمدید</h1>
        <p class="text-sm text-ink-secondary mb-6">وارد حساب کاربری خود شوید</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
          <div>
            <label class="text-xs font-medium text-ink-secondary mb-1 block">نام کاربری</label>
            <input class="input-field" formControlName="username" type="text" />
          </div>
          <div>
            <label class="text-xs font-medium text-ink-secondary mb-1 block">رمز عبور</label>
            <input class="input-field" formControlName="password" type="password" />
          </div>
          <button type="submit" class="btn-gradient mt-2 w-full" [disabled]="form.invalid || loading">
            {{ loading ? 'در حال ورود...' : 'ورود' }}
          </button>
        </form>

        <p class="text-xs text-ink-secondary mt-5 text-center">
          حساب کاربری ندارید؟
          <a routerLink="/register" class="text-primary-from font-medium">ثبت‌نام کنید</a>
        </p>

        <div class="mt-6 pt-4 border-t border-slate-100 text-xs text-ink-secondary">
          <p class="font-medium mb-1">حساب‌های تست:</p>
          <p>admin / Admin&#64;1234</p>
          <p>operator / Operator&#64;1234</p>
          <p>citizen / Citizen&#64;1234</p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loading = false;
  form = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService
      .login(this.form.getRawValue() as { username: string; password: string })
      .subscribe({
        next: () => {
          this.toast.success("با موفقیت وارد شدید.");
          this.router.navigate(["/map"]);
        },
        error: () => (this.loading = false),
        complete: () => (this.loading = false),
      });
  }
}

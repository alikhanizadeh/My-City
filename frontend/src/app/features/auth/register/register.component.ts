import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { ToastService } from "@core/services/toast.service";

const passwordsMatch: ValidatorFn = (group): ValidationErrors | null => {
  const p1 = group.get("password")?.value;
  const p2 = group.get("password2")?.value;
  return p1 === p2 ? null : { mismatch: true };
};

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div class="card w-full max-w-md p-8 stagger-item">
        <h1 class="text-xl font-bold text-ink-primary mb-1">ساخت حساب کاربری</h1>
        <p class="text-sm text-ink-secondary mb-6">به «شهر من» بپیوندید و مشکلات شهر را گزارش دهید</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium text-ink-secondary mb-1 block">نام</label>
              <input class="input-field" formControlName="first_name" type="text" />
            </div>
            <div>
              <label class="text-xs font-medium text-ink-secondary mb-1 block">نام خانوادگی</label>
              <input class="input-field" formControlName="last_name" type="text" />
            </div>
          </div>
          <div>
            <label class="text-xs font-medium text-ink-secondary mb-1 block">نام کاربری</label>
            <input class="input-field" formControlName="username" type="text" />
          </div>
          <div>
            <label class="text-xs font-medium text-ink-secondary mb-1 block">ایمیل</label>
            <input class="input-field" formControlName="email" type="email" />
          </div>
          <div>
            <label class="text-xs font-medium text-ink-secondary mb-1 block">شماره موبایل</label>
            <input class="input-field" formControlName="phone" type="text" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium text-ink-secondary mb-1 block">رمز عبور</label>
              <input class="input-field" formControlName="password" type="password" />
            </div>
            <div>
              <label class="text-xs font-medium text-ink-secondary mb-1 block">تکرار رمز عبور</label>
              <input class="input-field" formControlName="password2" type="password" />
            </div>
          </div>
          <p *ngIf="form.errors?.['mismatch'] && form.get('password2')?.touched" class="text-xs text-red-500">
            رمزهای عبور مطابقت ندارند.
          </p>

          <button type="submit" class="btn-gradient mt-2 w-full" [disabled]="form.invalid || loading">
            {{ loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام' }}
          </button>
        </form>

        <p class="text-xs text-ink-secondary mt-5 text-center">
          قبلاً ثبت‌نام کرده‌اید؟
          <a routerLink="/login" class="text-primary-from font-medium">وارد شوید</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  loading = false;
  form = this.fb.group(
    {
      first_name: [""],
      last_name: [""],
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      password: ["", [Validators.required, Validators.minLength(8)]],
      password2: ["", Validators.required],
    },
    { validators: passwordsMatch }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.toast.success("ثبت‌نام با موفقیت انجام شد. اکنون وارد شوید.");
        this.router.navigate(["/login"]);
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false),
    });
  }
}

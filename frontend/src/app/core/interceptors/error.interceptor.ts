import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "@core/services/auth.service";
import { ToastService } from "@core/services/toast.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = req.url.includes("/auth/");

      if (error.status === 401 && !isAuthEndpoint && authService.getRefreshToken()) {
        return authService.refreshToken().pipe(
          switchMap(({ access }) => {
            authService.setAccessToken(access);
            const retried = req.clone({
              setHeaders: { Authorization: `Bearer ${access}` },
            });
            return next(retried);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      const message = extractErrorMessage(error);
      if (error.status !== 401) {
        toastService.error(message);
      }
      return throwError(() => error);
    })
  );
};

function extractErrorMessage(error: HttpErrorResponse): string {
  if (error.error) {
    if (typeof error.error === "string") return error.error;
    if (error.error.detail) return error.error.detail;
    const firstKey = Object.keys(error.error)[0];
    if (firstKey) {
      const value = error.error[firstKey];
      return Array.isArray(value) ? value[0] : String(value);
    }
  }
  return "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
}

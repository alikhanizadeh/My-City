import { HttpClient } from "@angular/common/http";
import { Injectable, computed, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "@env/environment";
import {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
} from "@core/models/user.model";

const ACCESS_KEY = "shahre_man_access";
const REFRESH_KEY = "shahre_man_refresh";
const USER_KEY = "shahre_man_user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  private readonly currentUserSignal = signal<User | null>(
    this.readStoredUser()
  );
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly isOperatorOrAdmin = computed(() => {
    const user = this.currentUserSignal();
    return user?.role === "operator" || user?.role === "admin";
  });
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === "admin");

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register/`, payload);
  }

  login(payload: LoginPayload): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.baseUrl}/login/`, payload).pipe(
      tap((tokens) => this.storeSession(tokens))
    );
  }

  refreshToken(): Observable<{ access: string }> {
    const refresh = this.getRefreshToken();
    return this.http.post<{ access: string }>(`${this.baseUrl}/refresh/`, {
      refresh,
    });
  }

  fetchMe(): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/me/`)
      .pipe(tap((user) => this.setUser(user)));
  }

  logout(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(["/"]);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_KEY, token);
  }

  private storeSession(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_KEY, tokens.access);
    localStorage.setItem(REFRESH_KEY, tokens.refresh);
    this.setUser(tokens.user);
  }

  private setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}

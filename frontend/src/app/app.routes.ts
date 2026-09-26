import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth.guard";
import { roleGuard } from "@core/guards/role.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/landing/landing.component").then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: "map",
    loadComponent: () =>
      import("./features/map/map.component").then((m) => m.MapComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./features/auth/register/register.component").then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: "report/new",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/report-wizard/report-wizard.component").then(
        (m) => m.ReportWizardComponent
      ),
  },
  {
    path: "report/:id",
    loadComponent: () =>
      import("./features/report-detail/report-detail.component").then(
        (m) => m.ReportDetailComponent
      ),
  },
  {
    path: "my-reports",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/my-reports/my-reports.component").then(
        (m) => m.MyReportsComponent
      ),
  },
  {
    path: "admin",
    canActivate: [authGuard, roleGuard],
    loadComponent: () =>
      import("./features/admin-dashboard/admin-dashboard.component").then(
        (m) => m.AdminDashboardComponent
      ),
  },
  { path: "**", redirectTo: "" },
];

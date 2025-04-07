import type { Routes } from "@angular/router"
import { LoginComponent } from "./components/login/login.component"
import { SignupComponent } from "./components/signup/signup.component"
import { EmployeeListComponent } from "./components/employee-list/employee-list.component"
import { EmployeeDetailsComponent } from "./components/employee-details/employee-details.component"
import { EmployeeFormComponent } from "./components/employee-form/employee-form.component"
import { authGuard } from "./guards/auth.guard"

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "employees",
    component: EmployeeListComponent,
    canActivate: [authGuard],
  },
  {
    path: "employees/new",
    component: EmployeeFormComponent,
    canActivate: [authGuard],
  },
  {
    path: "employees/edit/:id",
    component: EmployeeFormComponent,
    canActivate: [authGuard],
  },
  {
    path: "employees/:id",
    component: EmployeeDetailsComponent,
    canActivate: [authGuard],
  },
  { path: "**", redirectTo: "/login" },
]



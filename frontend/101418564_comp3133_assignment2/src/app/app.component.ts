import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { HeaderComponent } from "./components/header/header.component"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  template: `
  <app-header></app-header>
  <main>
    <router-outlet></router-outlet>
  </main>
`,
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Employee Management System"
}


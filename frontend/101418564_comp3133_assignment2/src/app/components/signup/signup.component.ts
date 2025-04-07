import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup
  loading = false

  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  private snackBar = inject(MatSnackBar)

  constructor() {
    this.signupForm = this.fb.group(
      {
        username: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.checkPasswords },
    )
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/employees"])
    }
  }

  // Custom validator to check if passwords match
  checkPasswords(group: FormGroup) {
    const password = group.get("password")?.value
    const confirmPassword = group.get("confirmPassword")?.value

    return password === confirmPassword ? null : { notMatching: true }
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return
    }

    this.loading = true
    const { username, email, password } = this.signupForm.value

    this.authService.signup(username, email, password).subscribe({
      next: () => {
        this.loading = false
        this.snackBar.open("Registration successful!", "Close", {
          duration: 3000,
        })
        this.router.navigate(["/employees"])
      },
      error: (error) => {
        this.loading = false
        this.snackBar.open("Registration failed: " + error.message, "Close", {
          duration: 5000,
        })
      },
    })
  }
}


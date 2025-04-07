import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { EmployeeService } from "../../services/employee.service"

@Component({
  selector: "app-employee-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: "./employee-form.component.html",
  styleUrls: ["./employee-form.component.scss"],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup
  isEditMode = false
  employeeId: string | null = null
  loading = false
  imagePreview: string | ArrayBuffer | null = null
  departments = ["HR", "Engineering", "Sales", "Marketing", "Finance", "Operations"]
  positions = ["Manager", "Developer", "Designer", "Analyst", "Coordinator", "Director"]

  private fb = inject(FormBuilder)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private employeeService = inject(EmployeeService)
  private snackBar = inject(MatSnackBar)

  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      position: ["", [Validators.required]],
      department: ["", [Validators.required]],
      profilePicture: [""],
    })
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get("id")
    this.isEditMode = !!this.employeeId

    if (this.isEditMode && this.employeeId) {
      this.loadEmployeeData(this.employeeId)
    }
  }

  loadEmployeeData(id: string): void {
    this.loading = true
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          position: employee.position,
          department: employee.department,
          profilePicture: employee.profilePicture,
        })

        if (employee.profilePicture) {
          this.imagePreview = employee.profilePicture
        }

        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading employee data: " + error.message, "Close", {
          duration: 5000,
        })
        this.loading = false
        this.router.navigate(["/employees"])
      },
    })
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]

    if (file) {
      // Update form value
      this.employeeForm.patchValue({ profilePicture: file })

      // Preview image
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)

      // In a real application, you would upload the file to a server
      // and get back a URL to store in the database
      this.uploadProfilePicture(file)
    }
  }

  uploadProfilePicture(file: File): void {
    // This is a placeholder for actual file upload logic
    // In a real application, you would use a service to upload the file
    // and get back a URL to store in the database

    // Simulating file upload with a timeout
    setTimeout(() => {
      // For demo purposes, we're just using a data URL
      // In a real app, this would be the URL returned from your file upload service
      const reader = new FileReader()
      reader.onload = () => {
        const base64String = reader.result as string
        this.employeeForm.patchValue({ profilePicture: base64String })
      }
      reader.readAsDataURL(file)
    }, 1000)
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return
    }

    this.loading = true
    const employeeData = this.employeeForm.value

    if (this.isEditMode && this.employeeId) {
      // Update existing employee
      this.employeeService
        .updateEmployee({
          id: this.employeeId,
          ...employeeData,
        })
        .subscribe({
          next: () => {
            this.loading = false
            this.snackBar.open("Employee updated successfully", "Close", {
              duration: 3000,
            })
            this.router.navigate(["/employees"])
          },
          error: (error) => {
            this.loading = false
            this.snackBar.open("Error updating employee: " + error.message, "Close", {
              duration: 5000,
            })
          },
        })
    } else {
      // Add new employee
      this.employeeService.addEmployee(employeeData).subscribe({
        next: () => {
          this.loading = false
          this.snackBar.open("Employee added successfully", "Close", {
            duration: 3000,
          })
          this.router.navigate(["/employees"])
        },
        error: (error) => {
          this.loading = false
          this.snackBar.open("Error adding employee: " + error.message, "Close", {
            duration: 5000,
          })
        },
      })
    }
  }

  cancel(): void {
    this.router.navigate(["/employees"])
  }
}




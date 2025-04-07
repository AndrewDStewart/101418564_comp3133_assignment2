import { Component, type OnInit, Inject, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MAT_DIALOG_DATA, type MatDialogRef, MatDialogModule } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { EmployeeService } from "../../services/employee.service"

@Component({
  selector: "app-employee-details",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: "./employee-details.component.html",
  styleUrls: ["./employee-details.component.scss"],
})
export class EmployeeDetailsComponent implements OnInit {
  employee: any = null
  loading = true

  private employeeService = inject(EmployeeService)
  private snackBar = inject(MatSnackBar);

  constructor(
  public dialogRef: MatDialogRef<EmployeeDetailsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { employeeId: string },
) { }

  ngOnInit(): void {
    this.loadEmployeeDetails()
  }

  loadEmployeeDetails(): void {
    this.loading = true
    this.employeeService.getEmployee(this.data.employeeId).subscribe({
      next: (employee) => {
        this.employee = employee
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading employee details: " + error.message, "Close", {
          duration: 5000,
        })
        this.loading = false
        this.dialogRef.close()
      },
    })
  }

  close(): void {
    this.dialogRef.close()
  }
}




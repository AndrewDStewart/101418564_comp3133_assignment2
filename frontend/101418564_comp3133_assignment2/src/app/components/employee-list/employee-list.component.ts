import { Component, type OnInit, ViewChild, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup } from "@angular/forms"
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatTableModule } from "@angular/material/table"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { RouterModule, Router } from "@angular/router"
import { EmployeeService } from "../../services/employee.service"
import { EmployeeDetailsComponent } from "../employee-details/employee-details.component"

@Component({
  selector: "app-employee-list",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"],
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ["profilePicture", "firstName", "lastName", "email", "position", "department", "actions"]
  dataSource = new MatTableDataSource<any>([])
  loading = true
  searchForm: FormGroup
  departments = ["HR", "Engineering", "Sales", "Marketing", "Finance", "Operations"]
  positions = ["Manager", "Developer", "Designer", "Analyst", "Coordinator", "Director"]

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  private employeeService = inject(EmployeeService)
  private dialog = inject(MatDialog)
  private snackBar = inject(MatSnackBar)
  private router = inject(Router)
  private fb = inject(FormBuilder)

  constructor() {
    this.searchForm = this.fb.group({
      department: [""],
      position: [""],
    })
  }

  ngOnInit(): void {
    this.loadEmployees()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  loadEmployees(): void {
    this.loading = true
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.dataSource.data = employees
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading employees: " + error.message, "Close", {
          duration: 5000,
        })
        this.loading = false
      },
    })
  }

  searchEmployees(): void {
    this.loading = true
    const { department, position } = this.searchForm.value

    this.employeeService.searchEmployees(department, position).subscribe({
      next: (employees) => {
        this.dataSource.data = employees
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error searching employees: " + error.message, "Close", {
          duration: 5000,
        })
        this.loading = false
      },
    })
  }

  resetSearch(): void {
    this.searchForm.reset({
      department: "",
      position: "",
    })
    this.loadEmployees()
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  addEmployee(): void {
    this.router.navigate(["/employees/new"])
  }

  viewDetails(employee: any): void {
    this.dialog.open(EmployeeDetailsComponent, {
      width: "500px",
      data: { employeeId: employee.id },
    })
  }

  editEmployee(employee: any): void {
    this.router.navigate([`/employees/edit/${employee.id}`])
  }

  deleteEmployee(employee: any): void {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.loading = true
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.snackBar.open("Employee deleted successfully", "Close", {
            duration: 3000,
          })
          this.loadEmployees()
        },
        error: (error) => {
          this.loading = false
          this.snackBar.open("Error deleting employee: " + error.message, "Close", {
            duration: 5000,
          })
        },
      })
    }
  }
}


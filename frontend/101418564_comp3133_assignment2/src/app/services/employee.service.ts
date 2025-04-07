import { Injectable, inject } from "@angular/core"
import { Apollo, gql } from "apollo-angular"
import type { Observable } from "rxjs"
import { map } from "rxjs/operators"

const GET_EMPLOYEES = gql`
query GetEmployees {
  employees {
    id
    firstName
    lastName
    email
    position
    department
    profilePicture
  }
}
`

const GET_EMPLOYEE = gql`
query GetEmployee($id: ID!) {
  employee(id: $id) {
    id
    firstName
    lastName
    email
    position
    department
    profilePicture
  }
}
`

const SEARCH_EMPLOYEES = gql`
query SearchEmployees($department: String, $position: String) {
  searchEmployees(department: $department, position: $position) {
    id
    firstName
    lastName
    email
    position
    department
    profilePicture
  }
}
`

const ADD_EMPLOYEE = gql`
mutation AddEmployee(
  $firstName: String!
  $lastName: String!
  $email: String!
  $position: String!
  $department: String!
  $profilePicture: String
) {
  addEmployee(
    firstName: $firstName
    lastName: $lastName
    email: $email
    position: $position
    department: $department
    profilePicture: $profilePicture
  ) {
    id
    firstName
    lastName
    email
    position
    department
    profilePicture
  }
}
`

const UPDATE_EMPLOYEE = gql`
mutation UpdateEmployee(
  $id: ID!
  $firstName: String!
  $lastName: String!
  $email: String!
  $position: String!
  $department: String!
  $profilePicture: String
) {
  updateEmployee(
    id: $id
    firstName: $firstName
    lastName: $lastName
    email: $email
    position: $position
    department: $department
    profilePicture: $profilePicture
  ) {
    id
    firstName
    lastName
    email
    position
    department
    profilePicture
  }
}
`

const DELETE_EMPLOYEE = gql`
mutation DeleteEmployee($id: ID!) {
  deleteEmployee(id: $id) {
    id
  }
}
`

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private apollo = inject(Apollo)

  getEmployees(): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_EMPLOYEES,
      })
      .valueChanges.pipe(map((result) => result.data.employees))
  }

  getEmployee(id: string): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: GET_EMPLOYEE,
        variables: { id },
      })
      .valueChanges.pipe(map((result) => result.data.employee))
  }

  searchEmployees(department?: string, position?: string): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: SEARCH_EMPLOYEES,
        variables: { department, position },
      })
      .valueChanges.pipe(map((result) => result.data.searchEmployees))
  }

  addEmployee(employee: any): Observable<any> {
    return this.apollo
      .mutate({
        mutation: ADD_EMPLOYEE,
        variables: employee,
        refetchQueries: [{ query: GET_EMPLOYEES }],
      })
      .pipe(map((result: any) => result.data.addEmployee))
  }

  updateEmployee(employee: any): Observable<any> {
    return this.apollo
      .mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: employee,
        refetchQueries: [{ query: GET_EMPLOYEES }],
      })
      .pipe(map((result: any) => result.data.updateEmployee))
  }

  deleteEmployee(id: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id },
        refetchQueries: [{ query: GET_EMPLOYEES }],
      })
      .pipe(map((result: any) => result.data.deleteEmployee))
  }
}


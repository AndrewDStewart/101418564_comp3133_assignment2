import { Injectable, inject, PLATFORM_ID, Inject } from "@angular/core"
import { Apollo, gql } from "apollo-angular"
import { type Observable, BehaviorSubject } from "rxjs"
import { map, tap } from "rxjs/operators"
import { Router } from "@angular/router"
import { isPlatformBrowser } from "@angular/common"

const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
      id
      username
    }
  }
}
`

const SIGNUP = gql`
mutation Signup($username: String!, $email: String!, $password: String!) {
  signup(username: $username, email: $email, password: $password) {
    token
    user {
      id
      username
    }
  }
}
`

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private isBrowser: boolean

  private apollo = inject(Apollo)
  private router = inject(Router)

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
  this.isBrowser = isPlatformBrowser(platformId);
  this.loadUserFromStorage();
}

  private loadUserFromStorage() {
    if (this.isBrowser) {
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")

      if (token && user) {
        this.currentUserSubject.next(JSON.parse(user))
      }
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: LOGIN,
        variables: { username, password },
      })
      .pipe(
        map((result: any) => result.data.login),
        tap((data) => this.setSession(data)),
      )
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: SIGNUP,
        variables: { username, email, password },
      })
      .pipe(
        map((result: any) => result.data.signup),
        tap((data) => this.setSession(data)),
      )
  }

  private setSession(authResult: any) {
    if (this.isBrowser) {
      localStorage.setItem("token", authResult.token)
      localStorage.setItem("user", JSON.stringify(authResult.user))
    }
    this.currentUserSubject.next(authResult.user)
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    this.currentUserSubject.next(null)

    // Reset Apollo cache
    this.apollo.client.resetStore().then(() => {
      this.router.navigate(["/login"])
    })
  }

  isLoggedIn(): boolean {
    return this.isBrowser ? !!localStorage.getItem("token") : false
  }

  getCurrentUser() {
    return this.currentUserSubject.value
  }
}


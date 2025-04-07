import { bootstrapApplication } from "@angular/platform-browser"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideRouter } from "@angular/router"
import { provideHttpClient } from "@angular/common/http"
import { AppComponent } from "./app/app.component"
import { routes } from "./app/app.routes"
import { APOLLO_OPTIONS } from "apollo-angular"
import { HttpLink } from "apollo-angular/http"
import { InMemoryCache, ApolloLink } from "@apollo/client/core"
import { setContext } from "@apollo/client/link/context"

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const uri = "http://localhost:4000/graphql"

        // Auth link to add token to requests
        const auth = setContext((_, { headers }) => {
          const token = localStorage.getItem("token")

          return {
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : "",
            },
          }
        })

        const link = ApolloLink.from([auth, httpLink.create({ uri })])
        const cache = new InMemoryCache()

        return {
          link,
          cache,
        }
      },
      deps: [HttpLink],
    },
  ],
}).catch((err) => console.error(err))


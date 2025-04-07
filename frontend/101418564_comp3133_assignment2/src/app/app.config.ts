import { type ApplicationConfig, importProvidersFrom } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideHttpClient } from "@angular/common/http"
import { provideAnimations } from "@angular/platform-browser/animations"
import { HttpLink } from "apollo-angular/http"
import { Apollo, APOLLO_OPTIONS } from "apollo-angular"
import { InMemoryCache, ApolloLink } from "@apollo/client/core"
import { setContext } from "@apollo/client/link/context"
import { HttpClientModule } from "@angular/common/http"

import { routes } from "./app.routes"

export function createApollo(httpLink: HttpLink) {
  const uri = "http://localhost:4000/graphql" // Replace with your backend GraphQL endpoint

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
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(Apollo, HttpClientModule),
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
}


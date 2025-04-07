// src/app/graphql/graphql.module.ts
import { NgModule, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { HttpClientModule } from '@angular/common/http';

const uri = 'http://localhost:4000/graphql'; // Replace with your backend GraphQL endpoint

export function createApollo(httpLink: HttpLink, platformId: Object) {
  const isBrowser = isPlatformBrowser(platformId);
  
  // Auth link to add token to requests
  const auth = setContext((_, { headers }) => {
    const token = isBrowser ? localStorage.getItem('token') : null;
    
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      }
    };
  });

  const link = ApolloLink.from([auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache
  };
}

@NgModule({
  exports: [HttpClientModule],
  providers: [
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, PLATFORM_ID],
    },
  ],
})
export class GraphQLModule {}
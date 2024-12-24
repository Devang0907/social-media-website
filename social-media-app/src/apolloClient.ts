// filepath: /g:/social-app/social-media-app/src/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql', // Replace with your GraphQL server URL
  }),
  cache: new InMemoryCache(),
});
export default client;
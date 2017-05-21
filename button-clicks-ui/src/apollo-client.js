import ApolloClient, { createNetworkInterface } from 'apollo-client'

export default graphqlEndpoint => {
  const networkInterface = createNetworkInterface({
    uri: graphqlEndpoint,
  })

  return new ApolloClient({ networkInterface })
}


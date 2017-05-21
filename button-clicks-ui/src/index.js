import { ApolloProvider } from 'react-apollo'
import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'
import createApolloClient from './apollo-client'

const apolloClient = createApolloClient(
    `${ process.env.REACT_APP_API_HOST }/graphql`
)

ReactDOM.render(
  <ApolloProvider client={ apolloClient }>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)

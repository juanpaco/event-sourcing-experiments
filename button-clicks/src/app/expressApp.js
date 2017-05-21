import bodyParser from 'body-parser'
import cors from 'cors'
import cuid from 'cuid'
import express from 'express'
import letterOpener from 'letter-opener-express'

import createGraphqlServer from './graphql-server'

/**
 * @description - Middleware that adds a `context` object to a request so that
 *   we have a place to store temporary things in a given request.
 */
function primeRequestContext(req, res, next) {
    // eslint-disable-next-line no-param-reassign
  req.context = {
    correlationId: cuid(),
  }

  next()
}

/**
 * @description - When all else fails, and we know we're going 500, we hit this
 *   middleware so that we can at least see what the error was.
 */
// eslint-disable-next-line no-unused-vars
function lastChanceErrorHandler(err, req, res, next) {
    /* eslint-disable no-console */
  console.log('ruh-roh.  We have an #epicfail')
  console.log(err.message)
  console.log(err.stack)
    /* eslint-enable no-console */

  const error = { reason: err.message, stack: err.stack }

  res.status(500).json(error)
}

/**
 * @description - Given the application configuration, return an express
 *   application
 * @param {Object} config - The application configuration
 * @return {Express App} - The express application
 */
export default config => {
  const graphqlServer = createGraphqlServer(config)
  const app = express()

  if (config.env.useLetterOpener) {
    const letterOpenerOptions = {
      storageDir: config.env.emailDirectory,
      app,
    }

    letterOpener(letterOpenerOptions)
  }

  app.use(cors({ origin: true, credentials: true }))
  app.use(primeRequestContext)
  app.use('/graphql', bodyParser.json(), graphqlServer.server)
  app.use('/graphiql', graphqlServer.graphiql)
    // eslint-disable-next-line new-cap
  const appRouter = express.Router()

  appRouter.use(express.static('public'))

  app.use(appRouter)

  if (config.env.useLastChanceHandler) {
    app.use(lastChanceErrorHandler)
  }

  return app
}

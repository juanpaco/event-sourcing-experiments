import Promise from 'bluebird'

import createButtons from '../buttons'
import createDb from '../db'
import createEvents from '../events'
import createMailer from './mailer'
import createSendMail from '../send-email'
import env from './env'

global.Promise = Promise

// Insanely useful function in debug
global.logAndPassThrough = thing => {
    // eslint-disable-next-line no-console
  console.log(
        // eslint-disable-next-line global-require
        require('util').inspect(thing, { depth: null })
    )

  return thing
}

const db = createDb({
  allowDbWipe: env.allowDbWipe,
  allowPrepareView: env.allowPrepareView,
  databaseUrl: env.databaseUrl,
})

const events = createEvents({
  db,
})

const mailer = createMailer({
  directory: env.emailDirectory,
  from: env.emailSender,
  transportType: env.emailTransport,
})

const sendEmail = createSendMail({
  emit: events.emit,
  events,
  sendEmail: mailer,
})

const buttons = createButtons({ emit: events.emit, events })

const config = {
  buttons,
  db,
  env,
  events,
  sendEmail,
}

export default config

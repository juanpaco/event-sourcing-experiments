import cuid from 'cuid'
import test from 'blue-tape'

import { config } from '../../test-helper'

test(`${ __filename }: It creates an event`, t => {
  const context = { correlationId: cuid() }

  const instance = {
    type: 'buttonCreated',
    streamId: cuid(),
    streamType: 'button',
    payload: {},
  }

  return config.db.wipeDb()
      .then(() => config.events.queries.create(instance, context))
      .then(() => config.events.queries.all())
      .then(events => {
        t.equal(events.length, 1)

        const event = events[0]

        t.equal(event.streamId, instance.streamId, 'same agg id')
      })
})

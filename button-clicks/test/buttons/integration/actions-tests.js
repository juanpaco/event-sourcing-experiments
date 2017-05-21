import test from 'blue-tape'

import { config } from '../../test-helper'

test(`${ __filename }: It creates a button`, t => {
  const context = { correlationId: 'the legend of correlationId' }

  return config.db.wipeDb()
      .then(() => config.buttons.actions.createButton(context))
      .then(button => Promise.all([ button, config.events.queries.all() ]))
      .then(([ button, events ]) => {
        t.equal(button.clicks, 0, 'no clicks')
        t.equal(events.length, 1)

        const event = events[0]

        t.equal(event.aggregateId, button.id, 'button id matches agg id')
        t.equal(event.correlationId, context.correlationId, 'same cor id')
      })
})

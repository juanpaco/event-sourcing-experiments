import supertest from 'supertest'
import test from 'blue-tape'

import { app, config } from '../../test-helper'

test(`${ __filename }: It creates a button`, t => {
  const query = {
    query: `
      mutation {
        createButton {
          id
          clicks
        }
      }
    `,
  }

  return config.db.wipeDb()
    .then(() => Promise.resolve(
      supertest(app)
        .post('/graphql')
        .send(query)
        .expect(200)
    ))
    .then(({ body: { data: { createButton } } }) => createButton)
    .then(button => Promise.all([ button, config.events.queries.all() ]))
    .then(([ button, events ]) => {
      t.equal(button.clicks, 0, 'no clicks')
      t.equal(events.length, 1)

      const event = events[0]

      t.equal(event.streamId, button.id, 'button id matches agg id')
      t.ok(event.correlationId, 'has a correlation id')
    })
})

test(`${ __filename }: We can fetch all the buttons`, t => {
  const context = { correlationId: 'here is an id!' }

  const events = [
    { type: 'buttonCreated', streamId: '1', streamType: 'button' },
     { type: 'buttonCreated', streamId: '2', streamType: 'button' },
     { type: 'buttonCreated', streamId: '3', streamType: 'button' },
  ]

  const query = {
    query: `
      query {
        buttons {
          id
          clicks
        }
      }
    `,
  }

  return config.db.wipeDb()
    .then(() => Promise.all(
      events.map(e => config.events.queries.create(e, context))
    ))
    .then(() => Promise.resolve(
      supertest(app)
        .post('/graphql')
        .send(query)
        .expect(200)
    ))
    .then(({ body: { data: { buttons } } }) => buttons)
    .then(buttons => {
      t.equal(buttons.length, 3, 'correct # of buttons')
      t.equal(buttons[0].id, '1', 'correct button')
    })
})

test(`${ __filename }: We can click a button`, t => {
  const context = { correlationId: 'here is an id!' }

  const events = [
    { type: 'buttonCreated', streamId: '1', streamType: 'button' },
  ]

  const query = {
    query: `
      mutation ($id: String!){
        clickButton(id: $id) {
          id
          clicks
        }
      }
    `,
    variables: { id: '1' },
  }

  return config.db.wipeDb()
    .then(() => Promise.all(
      events.map(e => config.events.queries.create(e, context))
    ))
    .then(() => Promise.resolve(
      supertest(app)
        .post('/graphql')
        .send(query)
        .expect(200)
    ))
    .then(({ body: { data: { clickButton } } }) => clickButton)
    .then(({ id, clicks }) => {
      t.equal(id, '1', 'correct id')
      t.equal(clicks, 1, 'correct # of clicks')
    })
})

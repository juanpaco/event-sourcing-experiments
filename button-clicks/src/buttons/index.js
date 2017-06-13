import cuid from 'cuid'

export function rollup(events) {
  /* eslint-disable no-param-reassign */
  const reduction = events.reduce(
    (memo, e) => {
      switch (e.type) {
        case 'buttonClicked':
          // Calling this save since memo is created in this function
          // eslint-disable-next-line no-plusplus
          memo.entities[e.streamId].clicks++
          break
        case 'buttonCreated':
          memo.correctOrder.push(e.streamId)
          memo.entities[e.streamId] = { id: e.streamId, clicks: 0 }
          break
        default:
          break
      }

      return memo
    },
    { correctOrder: [], entities: {} },
  )
  /* eslint-enable no-param-reassign */

  return reduction.correctOrder.map(id => reduction.entities[id])
}

const createActions = ({ emit, eventsQueries }) => {
  function clickButton(buttonId, context = {}) {
    return emit(
      {
        type: 'buttonClicked',
        streamId: buttonId,
        streamType: 'button',
      },
      context,
    )
    .then(() => getButton(buttonId, context))
  }

  function createButton(context = {}) {
    // Do some validation
    const button = {
      id: cuid(),
      clicks: 0,
    }

    return emit(
      {
        type: 'buttonCreated',
        streamId: button.id,
        streamType: 'button',
      },
      context,
    )
    .then(() => button)
  }

  function getButton(id, context = {}) {
    return eventsQueries.allByStreamId(id, context)
      .then(rollup)
      .then(buttons => buttons[0])
  }

  function getButtons(context = {}) {
    return eventsQueries.allByStreamType('button', context)
      .then(rollup)
  }

  return {
    clickButton,
    createButton,
    getButtons,
  }
}

const createResolvers = ({ actions }) => ({
  root: {
    buttons(_, params, context) {
      return actions.getButtons(context)
    },
  },

  mutation: {
    clickButton(_, { id }, context) {
      return actions.clickButton(id, context)
    },

    createButton(_, params, context) {
      return actions.createButton(context)
    },
  },
})

// Schema
const Button = `
  type Button {
    id: String!
    clicks: Int!
  }
`

const schema = () => [ Button ]

export default ({ emit, events }) => {
  const actions = createActions({ emit, eventsQueries: events.queries })
  const resolvers = createResolvers({ actions })

  return {
    actions,
    resolvers,
    schema,
  }
}

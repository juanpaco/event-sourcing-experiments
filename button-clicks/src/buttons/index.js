import cuid from 'cuid'

export function rollup(events) {
  const reduction = events.reduce(
    (memo, e) => {
      switch (e.type) {
        case 'buttonClicked':
          memo.entities[e.aggregateId].clicks++
          break
        case 'buttonCreated':
          memo.correctOrder.push(e.aggregateId)
          memo.entities[e.aggregateId] = { id: e.aggregateId, clicks: 0 }
          break;
        default:
          break;
      }

      return memo
    },
    { correctOrder: [], entities: {} },
  )

  return reduction.correctOrder.map(id => reduction.entities[id])
}

const createActions = ({ emit, eventsQueries }) => {
  function clickButton(buttonId, context = {}) {
    return emit(
      {
        type: 'buttonClicked',
        aggregateId: buttonId,
        aggregateType: 'button',
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
        aggregateId: button.id,
        aggregateType: 'button',
      },
      context,
    )
    .then(() => button)
  }

  function getButton(id, context = {}) {
    return eventsQueries.allByAggregateId(id, context)
      .then(rollup)
      .then(buttons => buttons[0])
  }

  function getButtons(context = {}) {
    return eventsQueries.allByAggregateType('button', context) 
      .then(rollup)
  }

  return {
    clickButton,
    createButton,
    getButtons,
  }
}

const createResolvers = ({ actions }) => {
  return {
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
  }
}

// Schema
const Button = `
  type Button {
    id: String!
    clicks: Int!
  }
`

const schema = () => [ Button ]

export default ({ emit, events }) => {
    const actions = createActions({ emit, eventsQueries: events.queries });
    const resolvers = createResolvers({ actions });

    return {
      actions,
      resolvers,
      schema,
    }
}

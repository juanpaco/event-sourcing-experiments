import * as transforms from './transforms'

export default ({ db }) => {
  // In a real system there would be logging that uses context
  // eslint-disable-next-line no-unused-vars
  function all(context = {}) {
    return db.client.select().from('events')
      .then(rows => rows.map(transforms.itemToInstance))
  }

  // In a real system there would be logging that uses context
  // eslint-disable-next-line no-unused-vars
  function allByAggregateId(aggregateId, context = {}) {
    return db
      .client
      .select()
      .from('events')
      .where({ aggregate_id: aggregateId })
      .then(rows => rows.map(transforms.itemToInstance))
  }

  // In a real system there would be logging that uses context
  // eslint-disable-next-line no-unused-vars
  function allByAggregateType(aggregateType, context = {}) {
    return db
      .client
      .select()
      .from('events')
      .where({ aggregate_type: aggregateType })
      .then(rows => rows.map(transforms.itemToInstance))
  }

  // In a real system there would be logging that uses context
  // eslint-disable-next-line no-unused-vars
  function create(instance, context = {}) {
    const item = transforms.instanceToItem({
      ...instance,
      correlationId: context.correlationId,
    })

    return db.client('events').insert(item)
  }

  return {
    all,
    allByAggregateId,
    allByAggregateType,
    create,
  }
}

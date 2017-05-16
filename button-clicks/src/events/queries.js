import * as transforms from './transforms'

export default ({ db }) => {
  function all(context = {}) {
    return db.client.select().from('events')
      .then(rows => rows.map(transforms.itemToInstance))
  }

  function allByAggregateId(aggregateId, context = {}) {
    return db
      .client
      .select()
      .from('events')
      .where({ aggregate_id: aggregateId })
      .then(rows => rows.map(transforms.itemToInstance))
  }

  function allByAggregateType(aggregateType, context = {}) {
    return db
      .client
      .select()
      .from('events')
      .where({ aggregate_type: aggregateType })
      .then(rows => rows.map(transforms.itemToInstance))
  }

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

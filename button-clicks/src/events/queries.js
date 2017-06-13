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
  function allByStreamId(streamId, context = {}) {
    return db
      .client
      .select()
      .from('events')
      .where({ stream_id: streamId })
      .then(rows => rows.map(transforms.itemToInstance))
  }

  // In a real system there would be logging that uses context
  // eslint-disable-next-line no-unused-vars
  function allByStreamType(streamType, context = {}) {
    return db
      .client
      .select()
      .from('events')
      .where({ stream_type: streamType })
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
    allByStreamId,
    allByStreamType,
    create,
  }
}

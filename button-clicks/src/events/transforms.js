import { transforms } from 'haqt'
import { snakeCase } from 'lodash'

const fields = [
  'id',
  'streamId',
  'streamType',
  'correlationId',
  'payload',
]

const persistenceTransforms = transforms.createPersistenceTransforms(
  fields,
  snakeCase,
)

function itemToInstance(item) {
  const instance = persistenceTransforms.itemToInstance(item)

  instance.payload = JSON.parse(instance.payload)
  instance.type = item.event_type

  return instance
}

function instanceToItem(instance) {
  const item = persistenceTransforms.instanceToItem(instance)

  item.payload = JSON.stringify(instance.payload)
  item.event_type = instance.type

  return item
}

export { instanceToItem, itemToInstance }

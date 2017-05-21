import test from 'blue-tape'

import { app, config } from '../src/app'

test.onFinish(() => config.db.client.destroy())

function clearDb() {
  return config.db.wipeDb()
}

export { app, clearDb, config }

import { app, config } from '../src/app';
import test from 'blue-tape';

test.onFinish(() => config.db.client.destroy())

function clearDb() {
    return config.db.wipeDb();
}

export { app, clearDb, config };

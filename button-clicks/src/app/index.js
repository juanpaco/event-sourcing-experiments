import config from './config';

import createExpressApp from './expressApp';

const app = createExpressApp(config);

/*
 * @description - Starts the app listening for requests
*/
function start() {
    app.listen(config.env.port, signalAppStart);
}

/*
 * @description - Logs that the app started
*/
function signalAppStart() {
    // eslint-disable-next-line no-console
    console.log(`App started on port ${ config.env.port }`);
}

export { app, config, start };


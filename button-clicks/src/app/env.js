import colors from 'colors/safe';
import dotenv from 'dotenv';

const envFromRealEnvironment = process.env.NODE_ENV || 'development';
const path = `.env.${ envFromRealEnvironment }`;

dotenv.config({ path, silent: envFromRealEnvironment === 'production' });

function requireFromEnv(key) {
    if (!process.env[key]) {
        // eslint-disable-next-line no-console
        console.error(
            `${ colors.red('[APP ERROR] Missing env variable:') } ${ key }`
        );

        return process.exit(1);
    }

    return process.env[key];
}

export default {
    appName: 'button-clicks',
    allowDbWipe: requireFromEnv('ALLOW_DB_WIPE'),
    databaseUrl: requireFromEnv('DATABASE_URL'),
    emailDirectory: requireFromEnv('EMAIL_DIRECTORY'),
    emailSender: requireFromEnv('EMAIL_SENDER'),
    emailTransport: requireFromEnv('EMAIL_TRANSPORT'),
    env: requireFromEnv('NODE_ENV'),
    logLevel: requireFromEnv('LOG_LEVEL'),
    port: parseInt(requireFromEnv('PORT'), 10),
    useLastChanceHandler: requireFromEnv('USE_LAST_CHANCE_HANDLER') === 'true',
    useLetterOpener: requireFromEnv('USE_LETTER_OPENER') === 'true',
}

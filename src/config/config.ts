import * as process from 'node:process';

import { Config } from './config.types';

export default (): Config => {
  return {
    app: {
      host: process.env.APP_HOST || 'local',
      port: parseInt(process.env.APP_PORT) || 3000,
      environment: process.env.APP_ENVIRONMENT || 'local',
    },
    jwt: {
      accessTokenSecret:
        process.env.AUTH_ACCESS_TOKEN_SECRET || 'access secret',
    },
    postgres: {
      url: process.env.DATABASE_URL,
    },
  };
};

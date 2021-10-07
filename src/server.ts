import Hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';
import dotenv from 'dotenv';
import { spacesPlugin } from './plugins/spacesPlugin';
import prismaPlugin from './plugins/prismaPlugin';
import { usersPlugin } from './plugins/usersPlugin';

dotenv.config();

const server = Hapi.server({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 5000,
});

export const create = async () => {
  await server.register({
    plugin: hapiPino,
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      redact: ['req.headers.authorization'],
    },
  })

  await server.register([
    prismaPlugin,
    spacesPlugin,
    usersPlugin
  ]);

  await server.initialize();
  return server;
}

export const start = async () => {
  await server.start();
  console.log('info', `server is running on port ${server.info.uri}`);
  return server;
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
})
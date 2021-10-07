import Hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';
import dotenv from 'dotenv';
import { spacesPlugin } from './plugins/spacesPlugin';
import prismaPlugin from './plugins/prismaPlugin';

dotenv.config();

const server = Hapi.server({
  host: 'localhost',
  port: process.env.PORT || 3137,
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
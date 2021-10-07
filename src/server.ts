import Hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';
import dotenv from 'dotenv';
import { spacesPlugin } from './plugins/spacesPlugin';
import prismaPlugin from './plugins/prismaPlugin';

dotenv.config();

const server = Hapi.server({
  port: process.env.PORT || 3001
});


export const create = async () => {
  try {
    // await server.register({
    //   plugin: hapiPino,
    //   options: {
    //     logEvents: true,
    //     prettyPrint: true,
    //   }
    // })
  
    await server.register([
      prismaPlugin,
      spacesPlugin,
    ]);
  
    await server.initialize();
  } catch(error) { 
    console.error(error);
  }
  return server;
}

export const start = async () => {
  await server.initialize();
  server.log('info', `server is running on port ${server.info.uri}`);
  return server;
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
})
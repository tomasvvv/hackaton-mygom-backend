import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { Space } from '.prisma/client';

export const spacesPlugin = {
  name: 'spaces',
  dependencies: ['prisma'],
  register: (server: Hapi.Server) => {
    server.route([
      {
        method: 'GET',
        path: '/spaces',
        handler: getSpacesHandler,
      },
      {
        method: 'POST',
        path: '/spaces',
        handler: createSpaceHandler,
      }

    ]);
  }
};

const getSpacesHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const spaces = await prisma.space.findMany();
    return spaces;
  } catch (err) {
    return Boom.badRequest();
  }
}

const createSpaceHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const data = (request.payload || {}) as Space;
    const space = await prisma.space.create({ data })
    return h.response(space).code(200);
  } catch (err) {
    return Boom.badRequest();
  }
}
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { Space, User } from '.prisma/client';
import { spacesPlugin } from './spacesPlugin';

export const usersPlugin = {
  name: 'users',
  dependencies: ['prisma'],
  register: (server: Hapi.Server) => {
    server.route([
      {
        method: 'GET',
        path: '/users',
        handler: getUsersHandler,
        options: {
        }
      },
      {
        method: 'POST',
        path: '/users',
        handler: createUserHandler
      },
      {
        method: 'GET',
        path: '/users/spaces',
        handler: getUserSpacesHandler
      },
      {
        method: 'POST',
        path: '/users/spaces',
        handler: addUserSpaceHandler
      },
    ]);
  }
};

const addUserSpaceHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const { id } = (request.payload || {}) as User;
    const { spaceId } = request.payload as any;

    const user = await prisma.user.findFirst({where: {
      id
    }});

    if(!user) {
      return Boom.notFound('user not found');
    }

    const space = await prisma.space.findFirst({where: {
      id: spaceId
    }});
    if(!space) {
      return Boom.notFound('space not found');
    }

    const newEntry = await prisma.spaceUser.create({
      data: {
        spaceId: spaceId,
        userId: id
      }
    })

    return h.response(newEntry).code(201);
  }
  catch(err) {
    return Boom.internal();
  }

}

const getUserSpacesHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => { 
  const { prisma } = request.server.app;

  try { 
    const { id } = (request.payload || {}) as User;
    const user = await prisma.user.findFirst({ where: {
      id
    }})
    if(!user) {
      return Boom.notFound('user not found');
    }

    const spaceUserEntries = await prisma.spaceUser.findMany({ where: {
      userId: id
    }});

    let spaces: Space[] = [];

    Promise.all(spaceUserEntries.map(async (e) => {
      const space = await prisma.space.findFirst({ 
        where: {
          id: e.spaceId
        }
      });
      
      if(!space) return;
      spaces.push(space);
    }));

    return h.response(spaces).code(200);
  } catch(err) {
    return Boom.internal();
  }

}

const getUsersHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const users = await prisma.user.findMany();
    return h.response(users).code(200);
  } catch (err) {
    return Boom.internal();
  }
}

const createUserHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const data = (request.payload || {}) as User;
    const user = await prisma.user.create({
      data
    });
    return h.response(user).code(200);
  } catch (err) {
    return Boom.internal();
  }
}
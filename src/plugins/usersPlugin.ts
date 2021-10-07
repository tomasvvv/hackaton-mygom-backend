import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { User } from '.prisma/client';

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
        method: 'POST',
        path: '/users/spaces',
        handler: getUserSpacesHandler
      },
    ]);
  }
};

const addUserSpaceHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  
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

    const spaces = await prisma.space.findMany({
      where: {
        User: {
          every: {
            id: user.id
          }
        }
      }
    })

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
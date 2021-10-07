import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export const spacesPlugin = {
  name: 'spaces',
  dependencies: ['prisma'],
  register: (server: Hapi.Server) => {
    server.route([
      {
        method: 'GET',
        path: '/spaces',
        handler: getSpacesHandler,
        options: {

        }
      }

    ]);
  }
};

const getSpacesHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const { id } = request.params;

    const user = await prisma.user.findFirst({ where: {
      id
    }}); 

    if(id && !user) {
      return Boom.notFound('user not found');
    }

    const spaces = await prisma.space.findMany({ where: {
      usersAllowed: {
        every: {
          id
        }  
      }
    }});

    return h.response(spaces).code(200);
  } catch (err) {
    return Boom.badRequest();
  }
}
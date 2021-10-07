import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export const reservationsPlugin = {
  name: 'reservations',
  dependencies: ['prisma'],
  register: (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/reservations',
        handler: createReservationHandler,
        options: {
          
        }
      }

    ]);
  }
};

const createReservationHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const { userId, date, spaceId } = request.params;
    
    // check user
    const user = await prisma.user.findFirst({ where: {
      id: userId
    }});

    if(!user) {
      return Boom.notFound('user not found');
    }
    
    // check space
    const space = await prisma.space.findFirst({ where: {
      id: spaceId
    }});

    if(!space) {
      return Boom.notFound('space not found'); 
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        date,
        spaceId
      }
    });
    return h.response(reservation).code(201); 
  } catch (err) {
    return Boom.badRequest();
  }
}
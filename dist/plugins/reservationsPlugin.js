"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationsPlugin = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
exports.reservationsPlugin = {
    name: 'reservations',
    dependencies: ['prisma'],
    register: (server) => {
        server.route([
            {
                method: 'POST',
                path: '/reservations',
                handler: createReservationHandler,
                options: {}
            }
        ]);
    }
};
const createReservationHandler = async (request, h) => {
    const { prisma } = request.server.app;
    try {
        const { userId, date, spaceId } = request.params;
        // check user
        const user = await prisma.user.findFirst({ where: {
                id: userId
            } });
        if (!user) {
            return boom_1.default.notFound('user not found');
        }
        // check space
        const space = await prisma.space.findFirst({ where: {
                id: spaceId
            } });
        if (!space) {
            return boom_1.default.notFound('space not found');
        }
        const reservation = await prisma.reservation.create({
            data: {
                userId,
                date,
                spaceId
            }
        });
        return h.response(reservation).code(201);
    }
    catch (err) {
        return boom_1.default.badRequest();
    }
};
//# sourceMappingURL=reservationsPlugin.js.map
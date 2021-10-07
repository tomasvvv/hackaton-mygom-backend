"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spacesPlugin = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
exports.spacesPlugin = {
    name: 'spaces',
    dependencies: ['prisma'],
    register: (server) => {
        server.route([
            {
                method: 'GET',
                path: '/spaces',
                handler: getSpacesHandler,
                options: {}
            }
        ]);
    }
};
const getSpacesHandler = async (request, h) => {
    const { prisma } = request.server.app;
    try {
        const { id } = request.params;
        const user = await prisma.user.findFirst({ where: {
                id
            } });
        if (id && !user) {
            return boom_1.default.notFound('user not found');
        }
        const spaces = await prisma.space.findMany({ where: {
                usersAllowed: {
                    every: {
                        id
                    }
                }
            } });
        return h.response(spaces).code(200);
    }
    catch (err) {
        return boom_1.default.badRequest();
    }
};
//# sourceMappingURL=spacesPlugin.js.map
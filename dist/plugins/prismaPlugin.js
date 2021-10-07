"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaPlugin = {
    name: 'prisma',
    register: async function (server) {
        const prisma = new client_1.PrismaClient({
            log: ['error', 'warn', 'query'],
        });
        server.app.prisma = prisma;
        server.ext({
            type: 'onPostStop',
            method: async (server) => {
                server.app.prisma.$disconnect();
            },
        });
    },
};
exports.default = prismaPlugin;
//# sourceMappingURL=prismaPlugin.js.map
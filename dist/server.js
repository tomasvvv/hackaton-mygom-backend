"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.create = void 0;
const hapi_1 = __importDefault(require("@hapi/hapi"));
// import hapiPino from 'hapi-pino';
const dotenv_1 = __importDefault(require("dotenv"));
const spacesPlugin_1 = require("./plugins/spacesPlugin");
const prismaPlugin_1 = __importDefault(require("./plugins/prismaPlugin"));
dotenv_1.default.config();
const server = hapi_1.default.server({
    host: 'localhost',
    port: process.env.PORT || 3001,
});
const create = async () => {
    // await server.register({
    //   plugin: require('hapi-pino'),
    //   options: {
    //     logEvents: true,
    //     prettyPrint: true,
    //   }
    // })
    await server.register([
        prismaPlugin_1.default,
        spacesPlugin_1.spacesPlugin,
    ]);
    await server.initialize();
    return server;
};
exports.create = create;
const start = async () => {
    await server.initialize();
    console.log('info', `server is running on port ${server.info.uri}`);
    return server;
};
exports.start = start;
process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map
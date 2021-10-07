"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
(0, server_1.create)().then(() => (0, server_1.start)()).catch(error => console.log(error));
//# sourceMappingURL=index.js.map
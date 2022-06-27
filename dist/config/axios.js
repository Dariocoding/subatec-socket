"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const clienteAxios = axios_1.default.create({
    baseURL: process.env.BACKEND_URL,
});
exports.default = clienteAxios;
//# sourceMappingURL=axios.js.map
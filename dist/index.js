"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis = require("redis");
const pathEnv = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `${pathEnv}.env` });
/* const whitelist = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://subatec.com',
    'http://app.subatec.com',
]; */
const io = new socket_io_1.Server(+process.env.PORT || 8900, {
    cors: { origin: '*' },
});
exports.default = io;
const productionEnvs = {
    REDISPORT: 6700,
    REDISHOST: 'containers-us-west-75.railway.app',
    REDISUSER: 'default',
    REDISPASSWORD: 'm2LzgyD4NNkdBhAxGrxj',
};
const { REDISHOST, REDISPASSWORD, REDISPORT, REDISUSER } = productionEnvs;
exports.redisClient = redis.createClient({
    url: process.env.NODE_ENV !== 'producto'
        ? `redis://${REDISUSER}:${REDISPASSWORD}@${REDISHOST}:${REDISPORT}`
        : 'redis://localhost:6379',
    password: '',
});
const subClient = exports.redisClient.duplicate();
Promise.all([exports.redisClient.connect(), subClient.connect()]).then(() => {
    io.adapter((0, redis_adapter_1.createAdapter)(exports.redisClient, subClient));
    io.listen(3000);
    require('./app');
});
//# sourceMappingURL=index.js.map
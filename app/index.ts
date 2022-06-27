import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import * as redis from 'redis';
const pathEnv = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `${pathEnv}.env` });

/* const whitelist = [
	'http://localhost:3000',
	'http://localhost:3001',
	'https://subatec.com',
	'http://app.subatec.com',
]; */

console.log(process.env.NODE_ENV, process.env.PORT);

const io = new Server(+process.env.PORT || 8900, {
	cors: { origin: '*' },
});

export default io;

const productionEnvs = {
	REDISPORT: 6700,
	REDISHOST: 'containers-us-west-75.railway.app',
	REDISUSER: 'default',
	REDISPASSWORD: 'm2LzgyD4NNkdBhAxGrxj',
};

const { REDISHOST, REDISPASSWORD, REDISPORT, REDISUSER } = productionEnvs;

export const redisClient = redis.createClient({
	url:
		process.env.NODE_ENV !== 'producto'
			? `redis://${REDISUSER}:${REDISPASSWORD}@${REDISHOST}:${REDISPORT}`
			: 'redis://localhost:6379',
	password: '',
});
const subClient = redisClient.duplicate();

Promise.all([redisClient.connect(), subClient.connect()]).then(() => {
	io.adapter(createAdapter(redisClient, subClient));
	io.listen(3000);
	require('./app');
});

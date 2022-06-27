import io, { redisClient } from '.';
import { ObjectAutoSubasta, PujaAuto, PujaType } from './types';
import clienteAxios from './config/axios';
import { SocketTypes } from './config/socketTypes';

let timers: Array<{ timer: NodeJS.Timer; subastaid: number }> = [];

const nameSubasta = (subastaid: number) => `puja-subasta-${subastaid}`;

async function getSubastaPuja(subastaid: number) {
	const name = nameSubasta(subastaid);
	let subasta: ObjectAutoSubasta = JSON.parse(await redisClient.get(name));
	if (!subasta) {
		const object: ObjectAutoSubasta = { subastaid, pujas: [] };
		await setSubastaPuja(subastaid, object);
		subasta = object;
	}
	return subasta;
}

async function setSubastaPuja(subastaid: number, value: ObjectAutoSubasta) {
	await redisClient.set(nameSubasta(subastaid), JSON.stringify(value));
}

async function deleteSubastaPuja(subastaid: number) {
	await redisClient.del(nameSubasta(subastaid));
	clearTimerSubasta(subastaid);
}

function clearTimerSubasta(subastaid: number) {
	const timer = timers.find(t => t.subastaid === subastaid);
	if (timer) {
		timers = timers.filter(t => t.subastaid !== subastaid);
		clearInterval(timer.timer);
	}
}

async function RemoveAutoPujaUser(body: { subastaid: number; userid: number }) {
	const subasta = await getSubastaPuja(body.subastaid);

	subasta.pujas = subasta.pujas.filter(p => p.userid !== body.userid);
	if (subasta.pujas.length > 0) {
		setSubastaPuja(body.subastaid, subasta);
		return subasta;
	} else {
		deleteSubastaPuja(body.subastaid);
		clearTimerSubasta(body.subastaid);
	}
}

io.on('connection', socket => {
	socket.on(SocketTypes.on.SUBASTA_PUJA, PushSubasta);
	socket.on(SocketTypes.on.ADD_AUTO_PUJA, AddAutoPuja);
	socket.on(SocketTypes.on.GET_AUTO_PUJA, GetAutoPuja);
	socket.on(
		SocketTypes.on.STOP_AUTO_PUJA,
		async (body: { subastaid: number; userid: number }) => {
			await RemoveAutoPujaUser(body);
			io.emit(SocketTypes.emit.STOP_AUTO_PUJA, body);
		}
	);

	type PushSubasta = { puja: PujaType; preciosubasta: number; cantidadBids: number };

	function PushSubasta(body: PushSubasta) {
		io.emit(SocketTypes.emit.emitPuja(body.puja.subastaid), body);
		io.emit(SocketTypes.emit.SUBASTA_PUJA, {
			cantidadBids: body.cantidadBids,
			userid: body.puja.userid,
		});
	}

	async function AddAutoPuja(body: PujaAuto & { subastaid: number }) {
		let subasta = await getSubastaPuja(body.subastaid);

		if (subasta.pujas.find(p => p.userid === body.userid)) {
			subasta = await RemoveAutoPujaUser({
				subastaid: subasta.subastaid,
				userid: body.userid,
			});
		}

		if (!subasta) return;

		if (!timers.find(t => t.subastaid === subasta.subastaid)) {
			const timer = global.setInterval(
				() => intervalSubastaPuja(subasta.subastaid),
				10000
			);
			timers.push({ timer, subastaid: subasta.subastaid });
		}

		const newPujas = [...subasta.pujas, body];
		subasta.pujas = newPujas;
		setSubastaPuja(subasta.subastaid, subasta);
		io.emit(SocketTypes.emit.ADD_AUTO_PUJA, {
			subastaid: subasta.subastaid,
			userid: body.userid,
		});
	}

	async function intervalSubastaPuja(subastaid: number) {
		if (!subastaid) return;
		const subastaActual = await getSubastaPuja(subastaid);
		if (!subastaActual.pujas.length) {
			return clearTimerSubasta(subastaid);
		}
		const datosPuja = subastaActual.pujas[0];
		const puja: PujaType = { ...datosPuja, modalidad: 'A', subastaid };

		try {
			const req = await clienteAxios.post(`puja/${puja.userid}`, puja);
			PushSubasta(req.data);
			subastaActual.pujas.shift();
			const pujas = [...subastaActual.pujas, datosPuja];
			setSubastaPuja(subastaid, { subastaid, pujas });
		} catch (error) {
			if (error.message === 'Usuario sin bids') {
				await RemoveAutoPujaUser({
					subastaid: subastaid,
					userid: puja.userid,
				});
			} else deleteSubastaPuja(subastaid);
		}
	}

	async function GetAutoPuja(userid: number) {
		const TodasLasSubastasPujando = await redisClient.keys('*');

		const pujas = [];

		for (let i = 0; i < TodasLasSubastasPujando.length; i++) {
			const name = TodasLasSubastasPujando[i];
			if (name.includes('puja-subasta-')) {
				const parse = JSON.parse(await redisClient.get(name));
				if (parse) {
					const subasta = parse as ObjectAutoSubasta;
					for (let i = 0; i < subasta.pujas.length; i++) {
						const el = subasta.pujas[i];

						if (el.userid === userid)
							pujas.push(subasta.subastaid);
					}
				}
			}
		}

		io.emit(SocketTypes.emit.GET_AUTO_PUJA, pujas, userid);
	}
});

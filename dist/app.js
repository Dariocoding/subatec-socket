"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const axios_1 = require("./config/axios");
const socketTypes_1 = require("./config/socketTypes");
let timers = [];
const nameSubasta = (subastaid) => `puja-subasta-${subastaid}`;
function getSubastaPuja(subastaid) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = nameSubasta(subastaid);
        let subasta = JSON.parse(yield _1.redisClient.get(name));
        if (!subasta) {
            const object = { subastaid, pujas: [] };
            yield setSubastaPuja(subastaid, object);
            subasta = object;
        }
        return subasta;
    });
}
function setSubastaPuja(subastaid, value) {
    return __awaiter(this, void 0, void 0, function* () {
        yield _1.redisClient.set(nameSubasta(subastaid), JSON.stringify(value));
    });
}
function deleteSubastaPuja(subastaid) {
    return __awaiter(this, void 0, void 0, function* () {
        yield _1.redisClient.del(nameSubasta(subastaid));
        clearTimerSubasta(subastaid);
    });
}
function clearTimerSubasta(subastaid) {
    const timer = timers.find(t => t.subastaid === subastaid);
    if (timer) {
        timers = timers.filter(t => t.subastaid !== subastaid);
        clearInterval(timer.timer);
    }
}
function RemoveAutoPujaUser(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const subasta = yield getSubastaPuja(body.subastaid);
        subasta.pujas = subasta.pujas.filter(p => p.userid !== body.userid);
        if (subasta.pujas.length > 0) {
            setSubastaPuja(body.subastaid, subasta);
            return subasta;
        }
        else {
            deleteSubastaPuja(body.subastaid);
            clearTimerSubasta(body.subastaid);
        }
    });
}
_1.default.on('connection', socket => {
    socket.on(socketTypes_1.SocketTypes.on.SUBASTA_PUJA, PushSubasta);
    socket.on(socketTypes_1.SocketTypes.on.ADD_AUTO_PUJA, AddAutoPuja);
    socket.on(socketTypes_1.SocketTypes.on.GET_AUTO_PUJA, GetAutoPuja);
    socket.on(socketTypes_1.SocketTypes.on.STOP_AUTO_PUJA, (body) => __awaiter(void 0, void 0, void 0, function* () {
        yield RemoveAutoPujaUser(body);
        _1.default.emit(socketTypes_1.SocketTypes.emit.STOP_AUTO_PUJA, body);
    }));
    function PushSubasta(body) {
        _1.default.emit(socketTypes_1.SocketTypes.emit.emitPuja(body.puja.subastaid), body);
        _1.default.emit(socketTypes_1.SocketTypes.emit.SUBASTA_PUJA, {
            cantidadBids: body.cantidadBids,
            userid: body.puja.userid,
        });
    }
    function AddAutoPuja(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let subasta = yield getSubastaPuja(body.subastaid);
            if (subasta.pujas.find(p => p.userid === body.userid)) {
                subasta = yield RemoveAutoPujaUser({
                    subastaid: subasta.subastaid,
                    userid: body.userid,
                });
            }
            if (!subasta)
                return;
            if (!timers.find(t => t.subastaid === subasta.subastaid)) {
                const timer = global.setInterval(() => intervalSubastaPuja(subasta.subastaid), 10000);
                timers.push({ timer, subastaid: subasta.subastaid });
            }
            const newPujas = [...subasta.pujas, body];
            subasta.pujas = newPujas;
            setSubastaPuja(subasta.subastaid, subasta);
            _1.default.emit(socketTypes_1.SocketTypes.emit.ADD_AUTO_PUJA, {
                subastaid: subasta.subastaid,
                userid: body.userid,
            });
        });
    }
    function intervalSubastaPuja(subastaid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!subastaid)
                return;
            const subastaActual = yield getSubastaPuja(subastaid);
            if (!subastaActual.pujas.length) {
                return clearTimerSubasta(subastaid);
            }
            const datosPuja = subastaActual.pujas[0];
            const puja = Object.assign(Object.assign({}, datosPuja), { modalidad: 'A', subastaid });
            try {
                const req = yield axios_1.default.post(`puja/${puja.userid}`, puja);
                PushSubasta(req.data);
                subastaActual.pujas.shift();
                const pujas = [...subastaActual.pujas, datosPuja];
                setSubastaPuja(subastaid, { subastaid, pujas });
            }
            catch (error) {
                if (error.message === 'Usuario sin bids') {
                    yield RemoveAutoPujaUser({
                        subastaid: subastaid,
                        userid: puja.userid,
                    });
                }
                else
                    deleteSubastaPuja(subastaid);
            }
        });
    }
    function GetAutoPuja(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const TodasLasSubastasPujando = yield _1.redisClient.keys('*');
            const pujas = [];
            for (let i = 0; i < TodasLasSubastasPujando.length; i++) {
                const name = TodasLasSubastasPujando[i];
                if (name.includes('puja-subasta-')) {
                    const parse = JSON.parse(yield _1.redisClient.get(name));
                    if (parse) {
                        const subasta = parse;
                        for (let i = 0; i < subasta.pujas.length; i++) {
                            const el = subasta.pujas[i];
                            if (el.userid === userid)
                                pujas.push(subasta.subastaid);
                        }
                    }
                }
            }
            _1.default.emit(socketTypes_1.SocketTypes.emit.GET_AUTO_PUJA, pujas, userid);
        });
    }
});
//# sourceMappingURL=app.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketTypes = void 0;
exports.SocketTypes = {
    on: {
        SUBASTA_PUJA: 'subasta-puja',
        ADD_AUTO_PUJA: 'add-autopuja',
        GET_AUTO_PUJA: 'get-autopuja',
        STOP_AUTO_PUJA: 'stop-auto-puja',
    },
    emit: {
        emitPuja: (subastaid) => `subasta-${subastaid}-puja`,
        GET_AUTO_PUJA: 'get-autopuja',
        STOP_AUTO_PUJA: 'stop-auto-puja',
        ADD_AUTO_PUJA: 'add-autopuja',
        SUBASTA_PUJA: 'subasta-puja',
    },
};
//# sourceMappingURL=socketTypes.js.map
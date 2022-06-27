export const SocketTypes = {
	on: {
		SUBASTA_PUJA: 'subasta-puja',
		ADD_AUTO_PUJA: 'add-autopuja',
		GET_AUTO_PUJA: 'get-autopuja',
		STOP_AUTO_PUJA: 'stop-auto-puja',
	},
	emit: {
		emitPuja: (subastaid: number) => `subasta-${subastaid}-puja`,
		GET_AUTO_PUJA: 'get-autopuja',
		STOP_AUTO_PUJA: 'stop-auto-puja',
		ADD_AUTO_PUJA: 'add-autopuja',
		SUBASTA_PUJA: 'subasta-puja',
	},
};

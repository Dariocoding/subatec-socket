export type PujaAuto = {
	userid: number;
	cantidadBids: number;
	costopuja: number;
};

export type ObjectAutoSubasta = { pujas: PujaAuto[]; subastaid: number };

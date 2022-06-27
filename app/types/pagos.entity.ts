import { PaqueteBidType } from '.';
import { UserType } from './user.entity';

export interface PagoType {
	idpago?: number;
	user?: UserType;
	userid?: number;
	paqueteBid?: PaqueteBidType;
	paqueteBidId: number;
	amount?: number;
	reference?: string;
	date_created?: Date | string;
	cantidadBidsTotal: number;
	transactionStatus?: string;
	transactionId?: string;
}

import { SubastaType } from '.';
import { UserType } from './user.entity';

export type ModalidadPujaType = 'M' | 'A';

export interface PujaType {
	idpuja?: number;

	modalidad?: ModalidadPujaType;

	costopuja?: number;

	user?: UserType;

	userid?: number;

	subasta?: SubastaType;

	subastaid?: number;

	date_created?: Date;

	cantidadBids?: number;
}

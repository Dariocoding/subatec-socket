import { SubastaType } from './subastas.entity';
import { UserType } from './user.entity';

export interface FavoritosType {
	idfavorito?: number;
	user?: UserType;
	userid?: number;
	subasta?: SubastaType;
	subastaid?: number;
}

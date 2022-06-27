import { RolType } from './rol.entity';

export interface UserType {
	socketId?: string;
	socketIds?: string[];
	iduser?: number;
	username?: string;
	nombres?: string;
	apellidos?: string;
	hashedRt?: string;
	email_user?: string;
	telefono?: string;
	password?: string;
	token?: string;
	image_profile?: string;
	status?: number;
	date_created?: Date;
	facebookID?: string;
	googleID?: string;
	bids?: number;
	rolid?: number;
	rol?: RolType;
	pagos?: any[];
	favoritos?: any[];
}

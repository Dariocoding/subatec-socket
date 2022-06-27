import { UserType } from './user.entity';
export interface RolType {
	idrol: number;
	nombrerol: string;
	users?: UserType[];
}

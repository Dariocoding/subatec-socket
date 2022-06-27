import { ProductoType } from './articulos.entity';

export interface ImagenesType {
	id: number;
	filename: string;
	producto?: ProductoType;
	productoid?: number;
}

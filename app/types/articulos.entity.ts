import { CategoriaType } from './categorias.entity';
import { ImagenesType } from './imagenes.entity';
import { SubastaType } from './subastas.entity';

export interface ProductoType {
	idproducto: number;
	nombre: string;
	descripcion?: string;
	precio?: number;
	marca?: string;
	ruta?: string;
	codigo?: string;
	codigoTarjeta?: string;
	categoriaid?: number;
	categoria?: CategoriaType;
	status?: number;
	date_created?: Date;
	imagenes?: ImagenesType[];
	subastas?: SubastaType[];
}

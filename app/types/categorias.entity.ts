export interface CategoriaType {
	idcategoria?: number;
	nombre: string;
	ruta?: string;
	descripcion?: string;
	status?: number;
	portada?: string;
	totalproductos?: number;
	productos?: Array<any>;
}

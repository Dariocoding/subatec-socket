export interface SettingsType {
	id: number;
	nombre: string;
	correo: string;
	telefono: string;
	direccion: string;
	web: string;
	cantidad_subastas_inicio: number;
	orden_categoria: 'asc' | 'desc' | 'rand' | 'alphabet';
}

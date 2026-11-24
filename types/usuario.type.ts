import type {Turno} from "@/generated/prisma/client"

export type Registro = {
    nombre: string; 
    apellidoPaterno: string;
    apellidoMaterno: string; 
    matricula: number; 
    telefono: string, 
    universidad: string,
    carrera: string, 
    semestre: number, 
    turno: Turno, 
    correo:string; 
    password: string; 
}

export type login = {
    correo: string; 
    password: string;
}


import type { Materia, Prioridad, Estado } from "@/generated/prisma/client";

export type Tarea = {
    titulo: string;
    descripcion?: string;
    materia: Materia;
    fechaEntrega: Date;
    hora: Date;
    prioridad: Prioridad;
    estado: Estado;
    usuarioId: number;
};


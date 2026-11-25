import prisma from "@/lib/prisma";
import { AppError } from "@/lib/app-error";
import { Prisma } from "@/generated/prisma/client";
import type { Tarea } from "@/types/tareas.type";
import type { Prioridad } from "@/generated/prisma/client";

export type CrearTarea = Omit<Tarea, "usuarioId" | "hora"> & {
    hora: string;
};

export async function crearTarea(data: CrearTarea, usuarioID: number) {
    const [horas, minutos] = data.hora.split(":").map(Number);
    const hora = new Date(Date.UTC(1970, 0, 1, horas, minutos));

    const tarea = await prisma.tarea.create({
        data: {
            titulo: data.titulo,
            descripcion: data.descripcion ?? "",
            materia: data.materia,
            fechaEntrega: data.fechaEntrega,
            hora: hora,
            prioridad: data.prioridad,
            estado: data.estado,
            usuario: {
                connect: {
                    id: usuarioID
                }
            }
        }
    });

    return tarea;
}

export async function getTareas(
    usuarioID: number,
    prioridad?: Prioridad
) {
    const tareas = await prisma.tarea.findMany({
        where: {
            usuarioId: usuarioID,
            ...(prioridad && { prioridad })
        }
    });

    return tareas;
}

export type tareasActualizar = Partial<Omit<Tarea, "usuarioId" | "hora">> & {
    hora?: string;
};

type TareaActualizarPrisma = Omit<tareasActualizar, "hora"> & {
    hora?: Date;
};

export async function actualizarTarea(
    tareaID: number,
    usuarioID: number,
    data: tareasActualizar
) {
    try {
        const { hora, ...otrosDatos } = data;

        const datosActualizados: TareaActualizarPrisma = { ...otrosDatos };

        if (data.hora) {
            const [horas, minutos] = data.hora.split(":").map(Number);

            datosActualizados.hora = new Date(Date.UTC(1970, 0, 1, horas, minutos));
        }

        const tarea = await prisma.tarea.update({
            where: {
                id: tareaID,
                usuarioId: usuarioID
            },
            data: datosActualizados
        });

        return tarea;

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new AppError("Tarea no encontrada", 404);
        }

        throw error;
    }
}

export async function eliminarTarea(tareaID: number, usuarioID: number) {
    try {
        const tarea = await prisma.tarea.delete({
            where: {
                id: tareaID,
                usuarioId: usuarioID
            }
        });

        return tarea;

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new AppError("Tarea no encontrada", 404);
        }

        throw error;
    }
}

import primas from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { AppError } from "@/lib/app-error";
import type { Examen } from "@/types/examenes.type";
import { crearExamen, actualizarExamen } from "@/validations/examen.validation";
import { z } from "zod";

// Tipos para los datos recibidos desde las validaciones
type ExamenCrear = z.infer<typeof crearExamen>;
type ExamenActualizar = z.infer<typeof actualizarExamen>;

// Tipo para adaptar la hora que recibe Prisma
type ExamenActualizarPrisma = Omit<ExamenActualizar, "hora"> & {
    hora?: Date;
};

// Conversión de hora HH:mm a Date
function convertirHora(hora: string): Date {
    const [horas, minutos] = hora.split(":").map(Number);
    return new Date(Date.UTC(1970, 0, 1, horas, minutos));
}

// GET: Obtener todos los exámenes de un usuario
export async function obtenerExamenes(usuarioID: number) {
    const examenes = await primas.examen.findMany({
        where: {
            usuarioId: usuarioID
        },
        orderBy: {
            fecha: "asc"
        }
    });

    return examenes;
}

// POST: Registrar un examen
export async function registrarExamen(
    usuarioID: number,
    data: ExamenCrear
) {
    const examen: Examen = await primas.examen.create({
        data: {
            titulo: data.titulo,
            materia: data.materia,
            fecha: data.fecha,
            hora: convertirHora(data.hora),
            aula: data.aula,
            temasEvaluar: data.temasEvaluar ?? "",
            usuario: {
                connect: {
                    id: usuarioID
                }
            }
        }
    });

    return examen;
}

// PATCH: Actualizar un examen
export async function actualizarDatosExamen(
    examenID: number,
    usuarioID: number,
    data: ExamenActualizar
) {
    try {
        const { hora, ...otrosDatos } = data;

        const datosActualizados: ExamenActualizarPrisma = {
            ...otrosDatos
        };

        if (hora) {
            datosActualizados.hora = convertirHora(hora);
        }

        const examen = await primas.examen.update({
            where: {
                id: examenID,
                usuarioId: usuarioID
            },
            data: datosActualizados
        });

        return examen;

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new AppError("Examen no encontrado", 404);
        }

        throw error;
    }
}

// DELETE: Eliminar un examen
export async function eliminarExamen(
    examenID: number,
    usuarioID: number
) {
    try {
        const examen = await primas.examen.delete({
            where: {
                id: examenID,
                usuarioId: usuarioID
            },
            select: {
                id: true
            }
        });

        return examen;

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new AppError("Examen no encontrado", 404);
        }

        throw error;
    }
}

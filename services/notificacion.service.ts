
import primas from "@/lib/prisma";
import { AppError } from "@/lib/app-error";
import type {CrearNotificacion,ActualizarNotificacion,OrigenNotificacion} from "@/types/notificaciones.type";

// GET
export async function obtenerNotificaciones(usuarioID: number) {
    return await primas.notificacion.findMany({
        where: {
            usuarioId: usuarioID
        },
        include: {
            tarea: true,
            examen: true
        },
        orderBy: {
            id: "desc"
        }
    });
}

// POST
export async function registrarNotificacion(
    usuarioID: number,
    data: CrearNotificacion,
    origen: OrigenNotificacion
) {
    if ("tareaId" in origen) {
        const tarea = await primas.tarea.findFirst({
            where: {
                id: origen.tareaId,
                usuarioId: usuarioID
            },
            select: {
                id: true
            }
        });

        if (!tarea) {
            throw new AppError("Tarea no encontrada", 404);
        }

        return await primas.notificacion.create({
            data: {
                titulo: data.titulo,
                mensaje: data.mensaje ?? "",
                usuario: {
                    connect: { id: usuarioID }
                },
                tarea: {
                    connect: { id: tarea.id }
                }
            }
        });
    }

    const examen = await primas.examen.findFirst({
        where: {
            id: origen.examenId,
            usuarioId: usuarioID
        },
        select: {
            id: true
        }
    });

    if (!examen) {
        throw new AppError("Examen no encontrado", 404);
    }

    return await primas.notificacion.create({
        data: {
            titulo: data.titulo,
            mensaje: data.mensaje ?? "",
            usuario: {
                connect: { id: usuarioID }
            },
            examen: {
                connect: { id: examen.id }
            }
        }
    });
}

// PATCH - Actualizar título y mensaje
export async function actualizarNotificacion(
    notificacionID: number,
    usuarioID: number,
    data: ActualizarNotificacion
) {
    const resultado = await primas.notificacion.updateMany({
        where: {
            id: notificacionID,
            usuarioId: usuarioID
        },
        data
    });

    if (resultado.count === 0) {
        throw new AppError("Notificación no encontrada", 404);
    }

    return resultado;
}

// PATCH - Marcar como leída
export async function marcarNotificacionLeida(
    notificacionID: number,
    usuarioID: number
) {
    const resultado = await primas.notificacion.updateMany({
        where: {
            id: notificacionID,
            usuarioId: usuarioID,
            leida: false
        },
        data: {
            leida: true
        }
    });

    if (resultado.count === 0) {
        throw new AppError("Notificación no encontrada", 404);
    }

    return resultado;
}

// DELETE
export async function eliminarNotificacion(
    notificacionID: number,
    usuarioID: number
) {
    const resultado = await primas.notificacion.deleteMany({
        where: {
            id: notificacionID,
            usuarioId: usuarioID
        }
    });

    if (resultado.count === 0) {
        throw new AppError("Notificación no encontrada", 404);
    }

    return resultado;
}

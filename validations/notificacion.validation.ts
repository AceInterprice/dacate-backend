import {z} from "zod"; 

export const crearNotificacion = z.object({
    titulo: z.string().min(1,{message: "Titulo requerido"}),
    mensaje: z.string().optional(),
});

export const actualizarNotifiacion = crearNotificacion.partial().refine(
    data => Object.keys(data).length > 0,
    { message: "Debes proporcionar al menos un campo para actualizar" }
);
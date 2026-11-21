import z from "zod"; 
import {Materia, Prioridad, Estado} from "@/generated/prisma/client"

export const crearTareaSchema = z.object({
    titulo: z.string().min(1, {message: "Titulo requerido"}),
    descripcion: z.string().optional(), 
    materia: z.enum(Materia),
    fechaEntrega: z.coerce.date(),
    hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora debe tener el formato HH:mm"),
    prioridad: z.enum(Prioridad), 
    estado: z.enum(Estado)
});

export const actualizarTareaSchema = crearTareaSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        { message: "Debes proporcionar al menos un campo para actualizar" }
    );

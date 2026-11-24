import {z} from "zod"; 

export const crearExamen = z.object({
    titulo: z.string().min(1, {message: "Titulo requerido"}),
     materia: z.string().min(1, {message: "Escriba una materia"}),
    fecha: z.coerce.date(),
    hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora debe tener el formato HH:mm"),
    aula: z.string().min(1, {message: "Aula requerida"}),
    temasEvaluar: z.string().optional()
}); 

export const actualizarExamen = crearExamen.partial().refine(
     (data) => Object.keys(data).length > 0,
     { message: "Debes proporcionar al menos un campo para actualizar" }
)
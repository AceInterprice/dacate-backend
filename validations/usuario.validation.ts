import z from 'zod'; 

export const registroSchema = z.object({
    nombre: z.string().min(1, { message: "Nombre requerido" }),

    apellidoPaterno: z.string().min(1, { message: "Apellido Paterno requerido" }),

    apellidoMaterno: z.string().min(1, { message: "Apellido Materno requerido" }),

    matricula: z.number().positive({ message: "Matricula debe ser un numero positivo"}),

    correo: z.string().email({message: "Correo invalido"}),

    password: z.string().min(8, {message: "Contraseña debe tener al menos 8 caracteres"}),

    telefono: z.string().min(10, {message: "Telefono debe tener al menos 10 caracteres"}),

    universidad: z.string().min(1, {message: "Universidad requerida"}),

    carrera: z.string().min(1, {message: "Carrera requerida"}),

    semestre: z.number().int().positive({message: "Semestre debe ser un numero entero positivo"}),

    turno: z.enum(["MATUTINO", "VESPERTINO"], {message: "Seleccione un turno"})
});

export const loginSchema = z.object({
    correo: z.string().email({message: "Correo invalido"}),
    password: z.string().min(8, {message: "Contraseña incorrecta"})   
});

export const actualizarSchema = z.object({
    semestre: z.coerce.number().int().positive({
        message: "El semestre debe ser un número entero positivo"
    }).optional(),

    telefono: z.string().min(10, {
        message: "El teléfono debe tener al menos 10 caracteres"
    }).optional(),

    turno: z.enum(["MATUTINO", "VESPERTINO"], {
        message: "Turno inválido"
    }).optional(),

    carrera: z.string().min(1, {
        message: "La carrera es requerida"
    }).optional()

}).refine(
    datos => Object.values(datos).some(valor => valor !== undefined),
    {
        message: "Debes proporcionar al menos un campo para actualizar"
    }
);

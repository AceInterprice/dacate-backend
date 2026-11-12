import z from 'zod'; 

export const resgistroSchema = z.object({
    nombre: z.string().min(1, {message: "Nombre requerido"}), 
    apellidoPaterno: z.string().min(1, {message: "Apellido Paterno requerido"}),
    apellidoMaterno: z.string().min(1, {message: "Apellido Materno requerido"}), 
    matricula: z.number().positive({message: "Matricula debe ser un numero positivo"}), 
    correo: z.string().email({message: "Correo invalido"}), 
    password: z.string().min(8, {message: "Contraseña debe tener al menos 8 caracteres"})
});

export const loginSchema = z.object({
    correo: z.string().email({message: "Correo invalido"}),
    password: z.string().min(8, {message: "Contraseña incorrecta"})   
});
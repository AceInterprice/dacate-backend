import primas from '@/lib/prisma'; 
import type { Registro, login } from '@/types/usuario.type';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError } from '@/lib/app-error';
import { Prisma, Turno} from "@/generated/prisma/client";

export async function registrarUsuario(data: Registro) {
    try {
        const passwordHash = await bcrypt.hash(data.password, 10);

        const registro = await primas.usuario.create({
            data: {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                matricula: data.matricula,
                telefono: data.telefono,
                universidad: data.universidad,
                carrera: data.carrera,
                semestre: data.semestre,
                turno: data.turno,
                correo: data.correo,
                password: passwordHash
            }
        });

        return {
            nombre: registro.nombre,
            apellidoPaterno: registro.apellidoPaterno,
            apellidoMaterno: registro.apellidoMaterno,
            matricula: registro.matricula,
            correo: registro.correo
        };

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new AppError(
                "El correo, matrícula o teléfono ya están registrados",
                409
            );
        }

        throw error;
    }
}

export async function loginUsuario(data: login) {
    const usuario = await primas.usuario.findUnique({
        where: {
            correo: data.correo
        }
    });

    // 1. Validar existencia del usuario
    if (!usuario || !usuario.activo) {
        throw new AppError("Credenciales incorrectas", 401);
    }

    // 2. Comparar contraseña
    const passwordCorrecta = await bcrypt.compare(
        data.password,
        usuario.password
    );

    if (!passwordCorrecta) {
        throw new AppError("Credenciales incorrectas", 401);
    }

    // 3. Generar JWT
    const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );

    // 4. Devolver únicamente información pública
    return {
        usuario: {
            id: usuario.id,
            nombre: [
                usuario.nombre,
                usuario.apellidoPaterno,
                usuario.apellidoMaterno
            ].filter(Boolean).join(" "),
            correo: usuario.correo
        },
        token
    };
}

export async function getUsuario(id: number){
    const perfil = await primas.usuario.findUnique({
        where: {
            id: id
        }, 
        select: {
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
            telefono: true,
            universidad: true,
            carrera: true,
            semestre: true,
            turno: true,
            matricula: true,
            correo: true
        }
    })

    if(!perfil){
        throw new AppError("Usuario no encontrado", 404);
    }

    return perfil; 

}

export type UsuarioActualizar = Partial<{
    semestre: number;
    telefono: string;
    turno: Turno;
    carrera: string;
}>;

export async function actualizarPerfilUsuario(
    usuarioID: number,
    data: UsuarioActualizar
) {
    try {
        const usuario = await primas.usuario.update({
            where: {
                id: usuarioID
            },
            data,
            select: {
                id: true,
                nombre: true,
                apellidoPaterno: true,
                apellidoMaterno: true,
                matricula: true,
                correo: true,
                telefono: true,
                universidad: true,
                carrera: true,
                semestre: true,
                turno: true
            }
        });

        return usuario;

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new AppError("Usuario no encontrado", 404);
        }

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new AppError("El teléfono ya está registrado", 409);
        }

        throw error;
    }
}

export async function deleteUsuario(id: number) {
    try {
        const eliminar = await primas.usuario.delete({
            where: {
                id: id
            },
            select: {
                id: true
            }
        });

        return eliminar;

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new AppError("Usuario no encontrado", 404);
        }

        throw error;
    }
}



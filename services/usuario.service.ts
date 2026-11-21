import primas from '@/lib/prisma'; 
import type { Registro, login } from '@/types/usuario.type';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError } from '@/lib/app-error';
import { Prisma } from "@/generated/prisma/client";

export async function registrarUsuario(data: Registro) {
    try {
        const passwordHash = await bcrypt.hash(data.password, 10);

        const registro = await primas.usuario.create({
            data: {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                matricula: data.matricula,
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
                "El correo o la matrícula ya están registrados",
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
            matricula: true,
            correo: true
        }
    })

    if(!perfil){
        throw new AppError("Usuario no encontrado", 404);
    }

    return perfil; 

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



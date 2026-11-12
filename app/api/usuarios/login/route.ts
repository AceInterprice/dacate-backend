import {NextRequest, NextResponse} from 'next/server';
import type {ApiResponse} from '@/types/response.type';
import {loginSchema} from '@/validations/usuario.validation'; 
import {loginUsuario} from '@/services/usuario.service';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest){
 try {
        // 1. Recibir datos
        const body = await req.json();

        // 2. Validar datos
        const validacion = loginSchema.safeParse(body);

        if (!validacion.success) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "Datos inválidos",
                errors: validacion.error.issues.map(error => error.message)
            };

            return Response.json(respuesta, { status: 400 });
        }

        // 3. Ejecutar login y generar JWT
        const resultado = await loginUsuario(validacion.data);

        // 4. Crear cookie
        const cookieStore = await cookies();

        cookieStore.set("session", resultado.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24
        });

        // 5. Responder
        const respuesta: ApiResponse<typeof resultado.usuario> = {
            success: true,
            message: "Inicio de sesión correcto",
            data: resultado.usuario
        };

        return Response.json(respuesta, { status: 200 });

    } catch (error) {
        console.error("Error en login:", error);

        const respuesta: ApiResponse<null> = {
            success: false,
            message: "Error interno del servidor"
        };

        return Response.json(respuesta, { status: 500 });
    }
}
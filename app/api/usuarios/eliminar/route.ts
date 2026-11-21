import { NextResponse } from "next/server";
import { deleteUsuario } from "@/services/usuario.service";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { cookies } from "next/headers";
import { manejarError } from "@/lib/manejar-error";

export async function DELETE() {
    try {
        // 1. Obtener ID del usuario autenticado
        const usuarioId = await obtenerUsuarioAutenticado();

        // 2. Eliminar usuario
        await deleteUsuario(usuarioId);

        // 3. Eliminar cookie de sesión
        const cookieStore = await cookies();
        cookieStore.delete("session");

        // 4. Responder
        return NextResponse.json({
            success: true,
            message: "Usuario eliminado correctamente"
        }, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}
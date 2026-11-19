
import { NextRequest, NextResponse } from "next/server";
import { deleteUsuario } from "@/services/usuario.service";

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "ID de usuario requerido"
            }, { status: 400 });
        }

        const usuarioId = Number(id);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            return NextResponse.json({
                success: false,
                message: "ID de usuario inválido"
            }, { status: 400 });
        }

        await deleteUsuario(usuarioId);

        return NextResponse.json({
            success: true,
            message: "Usuario eliminado correctamente"
        }, { status: 200 });

    } catch (error) {
        console.error("ERROR DELETE:", error);

        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

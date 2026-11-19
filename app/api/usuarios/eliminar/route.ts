import {NextRequest, NextResponse}  from 'next/server';
import type {ApiResponse} from '@/types/response.type';
import {deleteUsuario} from '@/services/usuario.service'; 

type Context = {
    params: Promise<{ id: string }>;
};

export async function DELETE({params}:Context) {
    try{
        const {id} = await params;
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
    }
    catch(error){
        console.error(error);

        const respuesta: ApiResponse<null>={
            success: false, 
            message: "Error al eliminar al usuario"
        }
        return NextResponse.json(respuesta, { status: 500 });
    }
}
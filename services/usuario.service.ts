import primas from '@/lib/prisma'; 
import type { Registro, login } from '@/types/usuario.type';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export async function registrarUsuario(data: Registro){
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

    return{
            nombre: registro.nombre,
            apellidoPaterno: registro.apellidoPaterno,
            apellidoMaterno: registro.apellidoMaterno,
            matricula: registro.matricula,
            correo: registro.correo
        }
}

export async function loginUsuario(data: login ) {
    const usuario = await primas.usuario.findUnique({
        where: {
            correo: data.correo
        }
    }); 

    if(!usuario){
        throw new Error("Usuario no encontrado"); 
    }

    const passwordCorecto = await bcrypt.compare(data.password, usuario.password); 

    if(!passwordCorecto){
        throw new Error("Contraseña Incorrecta"); 
    }

    const token = jwt.sign(
        {
            correo: usuario.correo
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h"
        }
    )

    return {
        usuario:{
            id: usuario.id, 
        nombre: usuario.nombre + " " + usuario.apellidoPaterno + " " + usuario.apellidoMaterno,
        correo: usuario.correo
        },
        token
        
    }

}

export async function getUsuarioByID(id: number){
    return await primas.usuario.findUnique({
        where: {
            id: id
        }
    })
}


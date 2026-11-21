import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function obtenerUsuarioAutenticado() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        throw new Error("No hay una sesión activa");
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    if (typeof decoded.id !== "number") {
        throw new Error("Token inválido");
    }

    return decoded.id;
}


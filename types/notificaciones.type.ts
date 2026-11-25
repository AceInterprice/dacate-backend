export type notificacion = {
    titulo: string;
    mensaje?: string;
    leida: boolean;
    usuarioId: number;
    tareaId: number | null;
    examenId: number | null;
};

export type CrearNotificacion = Pick<notificacion, "titulo" | "mensaje">;

export type ActualizarNotificacion = Partial<CrearNotificacion>;

export type OrigenNotificacion =
    | { tareaId: number; examenId?: never }
    | { examenId: number; tareaId?: never };
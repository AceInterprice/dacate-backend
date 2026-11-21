export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
    errors?: {
        campo: string;
        mensaje: string;
    }[];
};
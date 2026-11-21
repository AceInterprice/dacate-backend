
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const DB = new URL(process.env.DATABASE_URL!);

console.log("Configuración DB:", {
    host: DB.hostname,
    port: DB.port,
    database: DB.pathname.slice(1),
    ssl: true
});

const adapter = new PrismaMariaDb({
  host: DB.hostname,
  port: Number(DB.port || 3306),
  user: `${decodeURIComponent(DB.username)}.${DB.hostname.split(".")[0]}`,
  password: decodeURIComponent(DB.password),
  database: decodeURIComponent(DB.pathname.slice(1)),
  connectionLimit: 5,
  ssl: true,
});

const prisma = new PrismaClient({ adapter });

export default prisma;

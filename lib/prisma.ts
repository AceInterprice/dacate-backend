import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const DB = new URL(process.env.DATABASE_URL!);

const esLocal = DB.hostname === "localhost"

const adapter = new PrismaMariaDb({
  host: DB.hostname,
  port: Number(DB.port || 3306),
  user: DB.hostname === "localhost"
    ? decodeURIComponent(DB.username)
    : `${decodeURIComponent(DB.username)}.${DB.hostname.split(".")[0]}`,
  password: decodeURIComponent(DB.password),
  database: decodeURIComponent(DB.pathname.slice(1)),
  connectionLimit: 5,
  ssl: esLocal ? undefined : true,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
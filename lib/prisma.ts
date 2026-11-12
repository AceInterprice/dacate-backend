import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const DB = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: DB.hostname,
port: Number(DB.port || 3306),
user: decodeURIComponent(DB.username),
password: decodeURIComponent(DB.password),
database: decodeURIComponent(DB.pathname.slice(1)),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
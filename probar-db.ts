import "dotenv/config";
import prisma from "./lib/prisma";

async function main() {
  await prisma.$connect();
  console.log("Conexión a MySQL exitosa");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
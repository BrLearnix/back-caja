import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const url = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.replace("/", ""),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const anioFiscal = await prisma.anioFiscal.create({
    data: {
      nombre: "2026",
      fechaInicio: new Date("2026-01-01"),
      fechaFin: new Date("2026-12-31"),
    },
  });

  const cajaPrincipal = await prisma.tipoCaja.create({
    data: { nombre: "CAJA PRINCIPAL", codigo: "CP" },
  });

  const cajaCajero = await prisma.tipoCaja.create({
    data: { nombre: "CAJA CAJERO", codigo: "CC" },
  });

  const cajaChica = await prisma.tipoCaja.create({
    data: { nombre: "CAJA CHICA", codigo: "CCH" },
  });

  await prisma.tipoMovimientoCaja.create({
    data: { nombre: "INGRESO", descripcion: "Ingreso de dinero" },
  });

  await prisma.tipoMovimientoCaja.create({
    data: { nombre: "EGRESO", descripcion: "Salida de dinero" },
  });

  await prisma.caja.create({
    data: {
      idTipoCaja: cajaPrincipal.idTipoCaja,
      idAnioFiscal: anioFiscal.idAnioFiscal,
      nombre: "CAJA PRINCIPAL",
      descripcion: "Caja principal de la empresa",
    },
  });

  await prisma.caja.create({
    data: {
      idTipoCaja: cajaCajero.idTipoCaja,
      idAnioFiscal: anioFiscal.idAnioFiscal,
      nombre: "CAJA CAJERO 01",
      descripcion: "Caja de atención al cliente",
    },
  });

  await prisma.caja.create({
    data: {
      idTipoCaja: cajaChica.idTipoCaja,
      idAnioFiscal: anioFiscal.idAnioFiscal,
      nombre: "CAJA CHICA",
      descripcion: "Caja para gastos menores",
    },
  });

  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

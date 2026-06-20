import { prisma } from "@/lib/prisma";
import type { TransferenciaCaja } from "@/generated/prisma/client";
import { createMovimiento } from "./movimiento-caja";

export type CreateTransferenciaInput = {
  idCajaEnvio: number;
  idCajaRecepcion: number;
  monto: number;
  observacion?: string | null;
  createdBy?: number | null;
};

export type AceptarTransferenciaInput = {
  updatedBy?: number | null;
  observacion?: string | null;
};

export function getAllTransferencias() {
  return prisma.transferenciaCaja.findMany({
    include: {
      cajaEnvio: true,
      cajaRecepcion: true,
    },
    orderBy: { fechaTransferencia: "desc" },
  });
}

export function getTransferenciaById(id: number) {
  return prisma.transferenciaCaja.findUnique({
    where: { idTransferencia: id },
    include: { cajaEnvio: true, cajaRecepcion: true },
  });
}

export function getTransferenciasByCaja(idCaja: number) {
  return prisma.transferenciaCaja.findMany({
    where: {
      OR: [{ idCajaEnvio: idCaja }, { idCajaRecepcion: idCaja }],
    },
    include: { cajaEnvio: true, cajaRecepcion: true },
    orderBy: { fechaTransferencia: "desc" },
  });
}

export function getTransferenciasPendientes() {
  return prisma.transferenciaCaja.findMany({
    where: { estado: "PENDIENTE" },
    include: { cajaEnvio: true, cajaRecepcion: true },
    orderBy: { fechaTransferencia: "desc" },
  });
}

export function createTransferencia(data: CreateTransferenciaInput) {
  return prisma.transferenciaCaja.create({ data });
}

export async function aceptarTransferencia(
  id: number,
  data?: AceptarTransferenciaInput
) {
  const transferencia = await prisma.transferenciaCaja.update({
    where: { idTransferencia: id },
    data: { estado: "ACEPTADO", ...data },
  });

  const monto = Number(transferencia.monto);

  await createMovimiento({
    idCaja: transferencia.idCajaEnvio,
    idTipoMovimiento: 2,
    monto,
    motivo: `Transferencia #${id} enviada a caja #${transferencia.idCajaRecepcion}`,
    createdBy: data?.updatedBy,
  });

  await createMovimiento({
    idCaja: transferencia.idCajaRecepcion,
    idTipoMovimiento: 1,
    monto,
    motivo: `Transferencia #${id} recibida de caja #${transferencia.idCajaEnvio}`,
    createdBy: data?.updatedBy,
  });

  return transferencia;
}

export function rechazarTransferencia(
  id: number,
  data?: AceptarTransferenciaInput
) {
  return prisma.transferenciaCaja.update({
    where: { idTransferencia: id },
    data: { estado: "RECHAZADO", ...data },
  });
}

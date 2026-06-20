import { prisma } from "@/lib/prisma";
import type { MovimientoCaja } from "@/generated/prisma/client";

export type CreateMovimientoInput = {
  idCaja: number;
  idTipoMovimiento: number;
  monto: number;
  motivo?: string | null;
  createdBy?: number | null;
};

export type UpdateMovimientoInput = Partial<
  Pick<MovimientoCaja, "motivo" | "estado">
>;

export function getAllMovimientos() {
  return prisma.movimientoCaja.findMany({
    include: { caja: true, tipoMovimiento: true },
    orderBy: { fechaMovimiento: "desc" },
  });
}

export function getMovimientoById(id: number) {
  return prisma.movimientoCaja.findUnique({
    where: { idMovimiento: id },
    include: { caja: true, tipoMovimiento: true },
  });
}

export function getMovimientosByCaja(idCaja: number) {
  return prisma.movimientoCaja.findMany({
    where: { idCaja },
    include: { tipoMovimiento: true },
    orderBy: { fechaMovimiento: "desc" },
  });
}

export function getMovimientosByTipo(idTipoMovimiento: number) {
  return prisma.movimientoCaja.findMany({
    where: { idTipoMovimiento },
    include: { caja: true },
    orderBy: { fechaMovimiento: "desc" },
  });
}

export function getMovimientosByDateRange(
  idCaja: number,
  desde: Date,
  hasta: Date
) {
  return prisma.movimientoCaja.findMany({
    where: {
      idCaja,
      fechaMovimiento: { gte: desde, lte: hasta },
    },
    include: { tipoMovimiento: true },
    orderBy: { fechaMovimiento: "desc" },
  });
}

export function createMovimiento(data: CreateMovimientoInput) {
  return prisma.movimientoCaja.create({ data });
}

export function updateMovimiento(id: number, data: UpdateMovimientoInput) {
  return prisma.movimientoCaja.update({
    where: { idMovimiento: id },
    data,
  });
}

export function deleteMovimiento(id: number) {
  return prisma.movimientoCaja.update({
    where: { idMovimiento: id },
    data: { estado: 0 },
  });
}

import { prisma } from "@/lib/prisma";
import type { AperturaCierreCaja } from "@/generated/prisma/client";

export type CreateAperturaInput = {
  idCaja: number;
  montoInicial: number;
  observacion?: string | null;
  createdBy?: number | null;
};

export type CerrarAperturaInput = {
  montoFinal: number;
  observacion?: string | null;
  updatedBy?: number | null;
};

export function getAllAperturas() {
  return prisma.aperturaCierreCaja.findMany({
    include: { caja: true },
    orderBy: { fechaApertura: "desc" },
  });
}

export function getAperturaById(id: number) {
  return prisma.aperturaCierreCaja.findUnique({
    where: { idApertura: id },
    include: { caja: true },
  });
}

export function getAperturasByCaja(idCaja: number) {
  return prisma.aperturaCierreCaja.findMany({
    where: { idCaja },
    include: { caja: true },
    orderBy: { fechaApertura: "desc" },
  });
}

export function getAperturaAbiertaByCaja(idCaja: number) {
  return prisma.aperturaCierreCaja.findFirst({
    where: { idCaja, estado: "ABIERTO" },
  });
}

export function createApertura(data: CreateAperturaInput) {
  return prisma.aperturaCierreCaja.create({ data });
}

export function cerrarApertura(id: number, data: CerrarAperturaInput) {
  return prisma.aperturaCierreCaja.update({
    where: { idApertura: id },
    data: {
      ...data,
      fechaCierre: new Date(),
      estado: "CERRADO",
    },
  });
}

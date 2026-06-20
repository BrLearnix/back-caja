import { prisma } from "@/lib/prisma";
import type { Caja } from "@/generated/prisma/client";

export type CreateCajaInput = {
  idTipoCaja: number;
  idAnioFiscal: number;
  nombre: string;
  descripcion?: string | null;
  createdBy?: number | null;
};

export type UpdateCajaInput = Partial<
  Pick<Caja, "nombre" | "descripcion" | "idTipoCaja" | "estado">
>;

export function getAllCajas() {
  return prisma.caja.findMany({
    include: { tipoCaja: true, anioFiscal: true },
    orderBy: { nombre: "asc" },
  });
}

export function getCajaById(id: number) {
  return prisma.caja.findUnique({
    where: { idCaja: id },
    include: { tipoCaja: true, anioFiscal: true },
  });
}

export function getCajasByTipo(idTipoCaja: number) {
  return prisma.caja.findMany({
    where: { idTipoCaja },
    include: { tipoCaja: true },
    orderBy: { nombre: "asc" },
  });
}

export function getCajasByAnioFiscal(idAnioFiscal: number) {
  return prisma.caja.findMany({
    where: { idAnioFiscal },
    include: { tipoCaja: true },
    orderBy: { nombre: "asc" },
  });
}

export function createCaja(data: CreateCajaInput) {
  return prisma.caja.create({ data });
}

export function updateCaja(id: number, data: UpdateCajaInput) {
  return prisma.caja.update({
    where: { idCaja: id },
    data,
  });
}

export function deleteCaja(id: number) {
  return prisma.caja.update({
    where: { idCaja: id },
    data: { estado: 0 },
  });
}

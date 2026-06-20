import { prisma } from "@/lib/prisma";
import type { TipoCaja } from "@/generated/prisma/client";

export type CreateTipoCajaInput = {
  nombre: string;
  codigo?: string | null;
  createdBy?: number | null;
};

export type UpdateTipoCajaInput = Partial<
  Pick<TipoCaja, "nombre" | "codigo" | "estado">
>;

export function getAllTiposCaja() {
  return prisma.tipoCaja.findMany({ orderBy: { nombre: "asc" } });
}

export function getTipoCajaById(id: number) {
  return prisma.tipoCaja.findUnique({ where: { idTipoCaja: id } });
}

export function createTipoCaja(data: CreateTipoCajaInput) {
  return prisma.tipoCaja.create({ data });
}

export function updateTipoCaja(id: number, data: UpdateTipoCajaInput) {
  return prisma.tipoCaja.update({
    where: { idTipoCaja: id },
    data,
  });
}

export function deleteTipoCaja(id: number) {
  return prisma.tipoCaja.update({
    where: { idTipoCaja: id },
    data: { estado: 0 },
  });
}

import { prisma } from "@/lib/prisma";
import type { AnioFiscal } from "@/generated/prisma/client";

export type CreateAnioFiscalInput = {
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  createdBy?: number | null;
};

export type UpdateAnioFiscalInput = Partial<
  Pick<AnioFiscal, "nombre" | "fechaInicio" | "fechaFin" | "estado">
>;

export function getAllAniosFiscales() {
  return prisma.anioFiscal.findMany({ orderBy: { fechaInicio: "desc" } });
}

export function getAnioFiscalById(id: number) {
  return prisma.anioFiscal.findUnique({ where: { idAnioFiscal: id } });
}

export function getActiveAnioFiscal() {
  return prisma.anioFiscal.findFirst({
    where: { estado: 1 },
    orderBy: { fechaInicio: "desc" },
  });
}

export function createAnioFiscal(data: CreateAnioFiscalInput) {
  return prisma.anioFiscal.create({ data });
}

export function updateAnioFiscal(id: number, data: UpdateAnioFiscalInput) {
  return prisma.anioFiscal.update({
    where: { idAnioFiscal: id },
    data,
  });
}

export function deleteAnioFiscal(id: number) {
  return prisma.anioFiscal.update({
    where: { idAnioFiscal: id },
    data: { estado: 0 },
  });
}

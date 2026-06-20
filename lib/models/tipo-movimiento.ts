import { prisma } from "@/lib/prisma";
import type { TipoMovimientoCaja } from "@/generated/prisma/client";

export type CreateTipoMovimientoInput = {
  nombre: string;
  descripcion?: string | null;
  createdBy?: number | null;
};

export type UpdateTipoMovimientoInput = Partial<
  Pick<TipoMovimientoCaja, "nombre" | "descripcion" | "estado">
>;

export function getAllTiposMovimiento() {
  return prisma.tipoMovimientoCaja.findMany({
    orderBy: { nombre: "asc" },
  });
}

export function getTipoMovimientoById(id: number) {
  return prisma.tipoMovimientoCaja.findUnique({
    where: { idTipoMovimiento: id },
  });
}

export function createTipoMovimiento(data: CreateTipoMovimientoInput) {
  return prisma.tipoMovimientoCaja.create({ data });
}

export function updateTipoMovimiento(
  id: number,
  data: UpdateTipoMovimientoInput
) {
  return prisma.tipoMovimientoCaja.update({
    where: { idTipoMovimiento: id },
    data,
  });
}

export function deleteTipoMovimiento(id: number) {
  return prisma.tipoMovimientoCaja.update({
    where: { idTipoMovimiento: id },
    data: { estado: 0 },
  });
}

import { NextRequest } from "next/server";
import {
  ok,
  badRequest,
  notFound,
  serverError,
  parseBody,
  getIdParam,
} from "@/lib/api-response";
import {
  getMovimientoById,
  updateMovimiento,
  deleteMovimiento,
} from "@/lib/models/movimiento-caja";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idMovimiento = getIdParam({ id });
    if (!idMovimiento) return badRequest("ID inválido");

    const movimiento = await getMovimientoById(idMovimiento);
    if (!movimiento) return notFound("Movimiento no encontrado");

    return ok(movimiento);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idMovimiento = getIdParam({ id });
    if (!idMovimiento) return badRequest("ID inválido");

    const body = await parseBody<{
      motivo?: string;
      estado?: number;
    }>(request);

    const existing = await getMovimientoById(idMovimiento);
    if (!existing) return notFound("Movimiento no encontrado");

    const movimiento = await updateMovimiento(idMovimiento, {
      ...(body.motivo !== undefined && { motivo: body.motivo }),
      ...(body.estado !== undefined && { estado: body.estado }),
    });

    return ok(movimiento, "Movimiento actualizado exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idMovimiento = getIdParam({ id });
    if (!idMovimiento) return badRequest("ID inválido");

    const existing = await getMovimientoById(idMovimiento);
    if (!existing) return notFound("Movimiento no encontrado");

    await deleteMovimiento(idMovimiento);
    return ok(null, "Movimiento anulado exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

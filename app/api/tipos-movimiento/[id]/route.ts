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
  getTipoMovimientoById,
  updateTipoMovimiento,
  deleteTipoMovimiento,
} from "@/lib/models/tipo-movimiento";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idTipo = getIdParam({ id });
    if (!idTipo) return badRequest("ID inválido");

    const tipo = await getTipoMovimientoById(idTipo);
    if (!tipo) return notFound("Tipo de movimiento no encontrado");

    return ok(tipo);
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
    const idTipo = getIdParam({ id });
    if (!idTipo) return badRequest("ID inválido");

    const body = await parseBody<{
      nombre?: string;
      descripcion?: string;
      estado?: number;
    }>(request);

    const existing = await getTipoMovimientoById(idTipo);
    if (!existing) return notFound("Tipo de movimiento no encontrado");

    const tipo = await updateTipoMovimiento(idTipo, {
      ...(body.nombre && { nombre: body.nombre }),
      ...(body.descripcion !== undefined && {
        descripcion: body.descripcion,
      }),
      ...(body.estado !== undefined && { estado: body.estado }),
    });

    return ok(tipo, "Tipo de movimiento actualizado exitosamente");
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
    const idTipo = getIdParam({ id });
    if (!idTipo) return badRequest("ID inválido");

    const existing = await getTipoMovimientoById(idTipo);
    if (!existing) return notFound("Tipo de movimiento no encontrado");

    await deleteTipoMovimiento(idTipo);
    return ok(null, "Tipo de movimiento desactivado exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

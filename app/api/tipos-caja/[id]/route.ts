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
  getTipoCajaById,
  updateTipoCaja,
  deleteTipoCaja,
} from "@/lib/models/tipo-caja";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idTipo = getIdParam({ id });
    if (!idTipo) return badRequest("ID inválido");

    const tipo = await getTipoCajaById(idTipo);
    if (!tipo) return notFound("Tipo de caja no encontrado");

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
      codigo?: string;
      estado?: number;
    }>(request);

    const existing = await getTipoCajaById(idTipo);
    if (!existing) return notFound("Tipo de caja no encontrado");

    const tipo = await updateTipoCaja(idTipo, {
      ...(body.nombre && { nombre: body.nombre }),
      ...(body.codigo !== undefined && { codigo: body.codigo }),
      ...(body.estado !== undefined && { estado: body.estado }),
    });

    return ok(tipo, "Tipo de caja actualizado exitosamente");
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

    const existing = await getTipoCajaById(idTipo);
    if (!existing) return notFound("Tipo de caja no encontrado");

    await deleteTipoCaja(idTipo);
    return ok(null, "Tipo de caja desactivado exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

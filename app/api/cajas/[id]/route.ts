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
  getCajaById,
  updateCaja,
  deleteCaja,
} from "@/lib/models/caja";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idCaja = getIdParam({ id });
    if (!idCaja) return badRequest("ID inválido");

    const caja = await getCajaById(idCaja);
    if (!caja) return notFound("Caja no encontrada");

    return ok(caja);
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
    const idCaja = getIdParam({ id });
    if (!idCaja) return badRequest("ID inválido");

    const body = await parseBody<{
      nombre?: string;
      descripcion?: string;
      idTipoCaja?: number;
      estado?: number;
    }>(request);

    const existing = await getCajaById(idCaja);
    if (!existing) return notFound("Caja no encontrada");

    const caja = await updateCaja(idCaja, {
      ...(body.nombre && { nombre: body.nombre }),
      ...(body.descripcion !== undefined && {
        descripcion: body.descripcion,
      }),
      ...(body.idTipoCaja && { idTipoCaja: body.idTipoCaja }),
      ...(body.estado !== undefined && { estado: body.estado }),
    });

    return ok(caja, "Caja actualizada exitosamente");
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
    const idCaja = getIdParam({ id });
    if (!idCaja) return badRequest("ID inválido");

    const existing = await getCajaById(idCaja);
    if (!existing) return notFound("Caja no encontrada");

    await deleteCaja(idCaja);
    return ok(null, "Caja desactivada exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

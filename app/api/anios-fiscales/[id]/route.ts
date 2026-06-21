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
  getAnioFiscalById,
  updateAnioFiscal,
  deleteAnioFiscal,
} from "@/lib/models/anio-fiscal";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idAnio = getIdParam({ id });
    if (!idAnio) return badRequest("ID inválido");

    const anio = await getAnioFiscalById(idAnio);
    if (!anio) return notFound("Año fiscal no encontrado");

    return ok(anio);
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
    const idAnio = getIdParam({ id });
    if (!idAnio) return badRequest("ID inválido");

    const body = await parseBody<{
      nombre?: string;
      fechaInicio?: string;
      fechaFin?: string;
      estado?: number;
    }>(request);

    const existing = await getAnioFiscalById(idAnio);
    if (!existing) return notFound("Año fiscal no encontrado");

    const anio = await updateAnioFiscal(idAnio, {
      ...(body.nombre && { nombre: body.nombre }),
      ...(body.fechaInicio && { fechaInicio: new Date(body.fechaInicio) }),
      ...(body.fechaFin && { fechaFin: new Date(body.fechaFin) }),
      ...(body.estado !== undefined && { estado: body.estado }),
    });

    return ok(anio, "Año fiscal actualizado exitosamente");
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
    const idAnio = getIdParam({ id });
    if (!idAnio) return badRequest("ID inválido");

    const existing = await getAnioFiscalById(idAnio);
    if (!existing) return notFound("Año fiscal no encontrado");

    await deleteAnioFiscal(idAnio);
    return ok(null, "Año fiscal desactivado exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

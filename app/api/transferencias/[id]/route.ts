import { NextRequest } from "next/server";
import {
  ok,
  badRequest,
  notFound,
  conflict,
  serverError,
  parseBody,
  getIdParam,
} from "@/lib/api-response";
import {
  getTransferenciaById,
  aceptarTransferencia,
  rechazarTransferencia,
} from "@/lib/models/transferencia-caja";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idTransferencia = getIdParam({ id });
    if (!idTransferencia) return badRequest("ID inválido");

    const transferencia = await getTransferenciaById(idTransferencia);
    if (!transferencia) return notFound("Transferencia no encontrada");

    return ok(transferencia);
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
    const idTransferencia = getIdParam({ id });
    if (!idTransferencia) return badRequest("ID inválido");

    const body = await parseBody<{
      action: "aceptar" | "rechazar";
      observacion?: string;
    }>(request);

    const transferencia = await getTransferenciaById(idTransferencia);
    if (!transferencia) return notFound("Transferencia no encontrada");

    if (transferencia.estado !== "PENDIENTE") {
      return conflict(
        `La transferencia ya fue ${transferencia.estado === "ACEPTADO" ? "aceptada" : "rechazada"}`
      );
    }

    if (body.action === "aceptar") {
      const aceptada = await aceptarTransferencia(idTransferencia, {
        observacion: body.observacion ?? null,
      });
      return ok(aceptada, "Transferencia aceptada exitosamente");
    }

    if (body.action === "rechazar") {
      const rechazada = await rechazarTransferencia(idTransferencia, {
        observacion: body.observacion ?? null,
      });
      return ok(rechazada, "Transferencia rechazada exitosamente");
    }

    return badRequest("Acción no válida. Use action: 'aceptar' o 'rechazar'");
  } catch (error) {
    return serverError(error);
  }
}

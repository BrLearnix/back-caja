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
  getAperturaById,
  cerrarApertura,
} from "@/lib/models/apertura-cierre-caja";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idApertura = getIdParam({ id });
    if (!idApertura) return badRequest("ID inválido");

    const apertura = await getAperturaById(idApertura);
    if (!apertura) return notFound("Apertura no encontrada");

    return ok(apertura);
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
    const idApertura = getIdParam({ id });
    if (!idApertura) return badRequest("ID inválido");

    const body = await parseBody<{
      action: string;
      montoFinal: number;
      observacion?: string;
    }>(request);

    if (body.action === "cerrar") {
      if (body.montoFinal === undefined) {
        return badRequest("montoFinal es requerido para cerrar apertura");
      }

      const apertura = await getAperturaById(idApertura);
      if (!apertura) return notFound("Apertura no encontrada");
      if (apertura.estado === "CERRADO") {
        return conflict("La apertura ya está cerrada");
      }

      const cerrada = await cerrarApertura(idApertura, {
        montoFinal: body.montoFinal,
        observacion: body.observacion ?? null,
      });

      return ok(cerrada, "Caja cerrada exitosamente");
    }

    return badRequest("Acción no válida. Use action: 'cerrar'");
  } catch (error) {
    return serverError(error);
  }
}

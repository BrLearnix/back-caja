import { NextRequest } from "next/server";
import {
  ok,
  created,
  badRequest,
  notFound,
  conflict,
  serverError,
  parseBody,
} from "@/lib/api-response";
import {
  getAllAperturas,
  getAperturasByCaja,
  createApertura,
  getAperturaAbiertaByCaja,
} from "@/lib/models/apertura-cierre-caja";
import { getCajaById } from "@/lib/models/caja";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idCaja = searchParams.get("idCaja");

    if (idCaja) {
      const aperturas = await getAperturasByCaja(Number(idCaja));
      return ok(aperturas);
    }

    const aperturas = await getAllAperturas();
    return ok(aperturas);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<{
      idCaja: number;
      montoInicial: number;
      observacion?: string;
    }>(request);

    if (!body.idCaja || body.montoInicial === undefined) {
      return badRequest("idCaja y montoInicial son requeridos");
    }

    const caja = await getCajaById(body.idCaja);
    if (!caja) return notFound("Caja no encontrada");

    const abierta = await getAperturaAbiertaByCaja(body.idCaja);
    if (abierta) {
      return conflict("La caja ya tiene una apertura activa");
    }

    const apertura = await createApertura({
      idCaja: body.idCaja,
      montoInicial: body.montoInicial,
      observacion: body.observacion ?? null,
    });

    return created(apertura, "Caja abierta exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

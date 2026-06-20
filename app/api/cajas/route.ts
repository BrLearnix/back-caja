import { NextRequest } from "next/server";
import {
  ok,
  created,
  badRequest,
  serverError,
  parseBody,
} from "@/lib/api-response";
import {
  getAllCajas,
  createCaja,
  getCajasByTipo,
  getCajasByAnioFiscal,
} from "@/lib/models/caja";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idTipo = searchParams.get("idTipo");
    const idAnio = searchParams.get("idAnio");

    if (idTipo) {
      const cajas = await getCajasByTipo(Number(idTipo));
      return ok(cajas);
    }

    if (idAnio) {
      const cajas = await getCajasByAnioFiscal(Number(idAnio));
      return ok(cajas);
    }

    const cajas = await getAllCajas();
    return ok(cajas);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<{
      idTipoCaja: number;
      idAnioFiscal: number;
      nombre: string;
      descripcion?: string;
    }>(request);

    if (!body.idTipoCaja || !body.idAnioFiscal || !body.nombre) {
      return badRequest("idTipoCaja, idAnioFiscal y nombre son requeridos");
    }

    const caja = await createCaja({
      idTipoCaja: body.idTipoCaja,
      idAnioFiscal: body.idAnioFiscal,
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
    });

    return created(caja, "Caja creada exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

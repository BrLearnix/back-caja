import { NextRequest } from "next/server";
import {
  ok,
  created,
  badRequest,
  serverError,
  parseBody,
} from "@/lib/api-response";
import {
  getAllAniosFiscales,
  createAnioFiscal,
} from "@/lib/models/anio-fiscal";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const anios = await getAllAniosFiscales();
    return ok(anios);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<{
      nombre: string;
      fechaInicio: string;
      fechaFin: string;
    }>(request);

    if (!body.nombre || !body.fechaInicio || !body.fechaFin) {
      return badRequest("nombre, fechaInicio y fechaFin son requeridos");
    }

    const anio = await createAnioFiscal({
      nombre: body.nombre,
      fechaInicio: new Date(body.fechaInicio),
      fechaFin: new Date(body.fechaFin),
    });

    return created(anio, "Año fiscal creado exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

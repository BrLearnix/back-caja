import { NextRequest } from "next/server";
import {
  ok,
  created,
  badRequest,
  serverError,
  parseBody,
} from "@/lib/api-response";
import {
  getAllTiposCaja,
  createTipoCaja,
} from "@/lib/models/tipo-caja";

export async function GET() {
  try {
    const tipos = await getAllTiposCaja();
    return ok(tipos);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<{
      nombre: string;
      codigo?: string;
    }>(request);

    if (!body.nombre) {
      return badRequest("nombre es requerido");
    }

    const tipo = await createTipoCaja({
      nombre: body.nombre,
      codigo: body.codigo ?? null,
    });

    return created(tipo, "Tipo de caja creado exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

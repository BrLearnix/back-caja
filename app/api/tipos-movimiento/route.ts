import { NextRequest } from "next/server";
import {
  ok,
  created,
  badRequest,
  serverError,
  parseBody,
} from "@/lib/api-response";
import {
  getAllTiposMovimiento,
  createTipoMovimiento,
} from "@/lib/models/tipo-movimiento";

export async function GET() {
  try {
    const tipos = await getAllTiposMovimiento();
    return ok(tipos);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<{
      nombre: string;
      descripcion?: string;
    }>(request);

    if (!body.nombre) {
      return badRequest("nombre es requerido");
    }

    const tipo = await createTipoMovimiento({
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
    });

    return created(tipo, "Tipo de movimiento creado exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

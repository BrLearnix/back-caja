import { NextRequest } from "next/server";
import {
  ok,
  badRequest,
  serverError,
  getIdParam,
} from "@/lib/api-response";
import { getCajasByTipo } from "@/lib/models/caja";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ idTipo: string }> }
) {
  try {
    const { idTipo } = await params;
    const id = getIdParam({ id: idTipo });
    if (!id) return badRequest("ID de tipo inválido");

    const cajas = await getCajasByTipo(id);
    return ok(cajas);
  } catch (error) {
    return serverError(error);
  }
}

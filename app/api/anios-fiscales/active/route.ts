import { ok, notFound, serverError } from "@/lib/api-response";
import { getActiveAnioFiscal } from "@/lib/models/anio-fiscal";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const anio = await getActiveAnioFiscal();

    if (!anio) {
      return notFound("No hay un año fiscal activo");
    }

    return ok(anio);
  } catch (error) {
    return serverError(error);
  }
}

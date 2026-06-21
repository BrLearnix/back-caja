import { ok, serverError } from "@/lib/api-response";
import { getTransferenciasPendientes } from "@/lib/models/transferencia-caja";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const transferencias = await getTransferenciasPendientes();
    return ok(transferencias);
  } catch (error) {
    return serverError(error);
  }
}

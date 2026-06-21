import { NextRequest } from "next/server";
import {
  ok,
  created,
  badRequest,
  notFound,
  serverError,
  parseBody,
} from "@/lib/api-response";
import {
  getAllMovimientos,
  getMovimientosByCaja,
  getMovimientosByTipo,
  getMovimientosByDateRange,
  createMovimiento,
} from "@/lib/models/movimiento-caja";
import { getCajaById } from "@/lib/models/caja";
import { getTipoMovimientoById } from "@/lib/models/tipo-movimiento";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idCaja = searchParams.get("idCaja");
    const idTipo = searchParams.get("idTipo");
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");

    if (idCaja && desde && hasta) {
      const movimientos = await getMovimientosByDateRange(
        Number(idCaja),
        new Date(desde),
        new Date(hasta)
      );
      return ok(movimientos);
    }

    if (idCaja) {
      const movimientos = await getMovimientosByCaja(Number(idCaja));
      return ok(movimientos);
    }

    if (idTipo) {
      const movimientos = await getMovimientosByTipo(Number(idTipo));
      return ok(movimientos);
    }

    const movimientos = await getAllMovimientos();
    return ok(movimientos);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<{
      idCaja: number;
      idTipoMovimiento: number;
      monto: number;
      motivo?: string;
    }>(request);

    if (!body.idCaja || !body.idTipoMovimiento || !body.monto) {
      return badRequest(
        "idCaja, idTipoMovimiento y monto son requeridos"
      );
    }

    const caja = await getCajaById(body.idCaja);
    if (!caja) return notFound("Caja no encontrada");

    const tipo = await getTipoMovimientoById(body.idTipoMovimiento);
    if (!tipo) return notFound("Tipo de movimiento no encontrado");

    const movimiento = await createMovimiento({
      idCaja: body.idCaja,
      idTipoMovimiento: body.idTipoMovimiento,
      monto: body.monto,
      motivo: body.motivo ?? null,
    });

    return created(movimiento, "Movimiento registrado exitosamente");
  } catch (error) {
    return serverError(error);
  }
}

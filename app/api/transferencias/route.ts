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
  getAllTransferencias,
  getTransferenciasByCaja,
  createTransferencia,
} from "@/lib/models/transferencia-caja";
import { getCajaById } from "@/lib/models/caja";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idCaja = searchParams.get("idCaja");

    if (idCaja) {
      const transferencias = await getTransferenciasByCaja(Number(idCaja));
      return ok(transferencias);
    }

    const transferencias = await getAllTransferencias();
    return ok(transferencias);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<{
      idCajaEnvio: number;
      idCajaRecepcion: number;
      monto: number;
      observacion?: string;
    }>(request);

    if (!body.idCajaEnvio || !body.idCajaRecepcion || !body.monto) {
      return badRequest(
        "idCajaEnvio, idCajaRecepcion y monto son requeridos"
      );
    }

    if (body.idCajaEnvio === body.idCajaRecepcion) {
      return badRequest(
        "La caja de origen y destino deben ser diferentes"
      );
    }

    const cajaEnvio = await getCajaById(body.idCajaEnvio);
    if (!cajaEnvio) return notFound("Caja de origen no encontrada");

    const cajaRecepcion = await getCajaById(body.idCajaRecepcion);
    if (!cajaRecepcion) return notFound("Caja de destino no encontrada");

    const transferencia = await createTransferencia({
      idCajaEnvio: body.idCajaEnvio,
      idCajaRecepcion: body.idCajaRecepcion,
      monto: body.monto,
      observacion: body.observacion ?? null,
    });

    return created(
      transferencia,
      "Transferencia creada exitosamente"
    );
  } catch (error) {
    return serverError(error);
  }
}

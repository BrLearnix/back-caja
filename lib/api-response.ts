import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export function ok<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>({
    success: true,
    data,
    message,
  });
}

export function created<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data, message },
    { status: 201 }
  );
}

export function badRequest(error: string) {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status: 400 }
  );
}

export function notFound(error = "Recurso no encontrado") {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status: 404 }
  );
}

export function conflict(error: string) {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status: 409 }
  );
}

export function serverError(error?: unknown) {
  const message =
    error instanceof Error ? error.message : "Error interno del servidor";
  return NextResponse.json<ApiResponse>(
    { success: false, error: message },
    { status: 500 }
  );
}

export function parseBody<T>(request: Request): Promise<T> {
  return request.json();
}

export function getIdParam(params: { id?: string }): number | null {
  const id = Number(params.id);
  return Number.isNaN(id) ? null : id;
}

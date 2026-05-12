export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    message: message || 'Success',
  };
}

export function errorResponse(error: string, message?: string): ApiErrorResponse {
  return {
    success: false,
    error,
    message,
  };
}

export function jsonSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response {
  return new Response(
    JSON.stringify(successResponse(data)),
    {
      headers: { 'Content-Type': 'application/json' },
      status,
    }
  );
}

export function jsonError(
  res: Response,
  error: string,
  statusCode: number = 400
): Response {
  return new Response(
    JSON.stringify(errorResponse(error)),
    {
      headers: { 'Content-Type': 'application/json' },
      status,
    }
  );
}

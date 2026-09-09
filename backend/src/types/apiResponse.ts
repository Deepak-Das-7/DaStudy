export type ApiError = {
    code: string;
    details?: unknown;
};

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type SuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
    pagination?: PaginationMeta;
};

export type ErrorResponse = {
    success: false;
    message: string;
    error: ApiError;
};

export type ApiResponse<T> =
    | SuccessResponse<T>
    | ErrorResponse;
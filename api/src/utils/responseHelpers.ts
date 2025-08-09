import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ResponseHelper {
  static success<T>(res: Response, data: T, message?: string, statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message
    };

    return res.status(statusCode).json(response);
  }

  static error(res: Response, error: string, statusCode: number = 400): Response {
    const response: ApiResponse = {
      success: false,
      error
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message?: string): Response {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static notFound(res: Response, message: string = 'Recurso não encontrado'): Response {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message: string = 'Não autorizado'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Acesso negado'): Response {
    return this.error(res, message, 403);
  }

  static serverError(res: Response, message: string = 'Erro interno do servidor'): Response {
    return this.error(res, message, 500);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponse<T[]> = {
      success: true,
      data,
      message,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };

    return res.status(200).json(response);
  }
} 
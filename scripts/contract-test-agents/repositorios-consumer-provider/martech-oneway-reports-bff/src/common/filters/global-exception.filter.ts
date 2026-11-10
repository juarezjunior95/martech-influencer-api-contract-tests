import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // For non-HTTP contexts (e.g., queue messages)
    // Errors will be inspected via DLQ
    if (host.getType() !== "http") {
      throw exception;
    }

    const { status, message } = this.extractErrorData(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(status).json({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Extracts status code and message from exception
   */
  private extractErrorData(exception: unknown): {
    status: number;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return {
        status: exception.getStatus(),
        message:
          typeof response === "string"
            ? response
            : (response as { message?: string }).message || exception.message,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        exception instanceof Error
          ? exception.message
          : "Internal server error",
    };
  }
}

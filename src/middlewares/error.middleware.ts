import { ErrorMiddleware } from "@decorators/express";
import { NextFunction, Request, Response } from "express";
import { Injectable } from "@decorators/di";

@Injectable()
export class GlobalErrorMiddleware implements ErrorMiddleware {
  public use(
    e: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    console.error('Global error middleware')
    return response.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
      metadata: {
        statusCode: 500,
        resource: request.url,
        timestamp: new Date().toString(),
      },
    });
  }
}

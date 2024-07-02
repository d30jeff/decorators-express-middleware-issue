import "reflect-metadata";
import { Application } from "@/interfaces/application.interface.js";
import { Container } from "@decorators/di";
import { ERROR_MIDDLEWARE, attachControllers } from "@decorators/express";
import express, { Router } from "express";
import { ExpressRequest } from '@/interfaces/express.interface.js';
import { GlobalErrorMiddleware } from '@/middlewares/error.middleware.js';

export const createApplication = async (
  params: Application.CreateApplicationParams
): Promise<Application.Instance> => {
  const { name, controllers, origin, staticPaths } = params;

  if (!name) {
    throw Error("Application name is required");
  }

  const app = express();

  const router = Router();
  attachControllers(router, controllers);

  app.use("/v1", router);

  const container = new Container();

  container.provide([
    {
      provide: ERROR_MIDDLEWARE,
      useClass: GlobalErrorMiddleware,
    },
  ]);

  app.use((request: ExpressRequest, response) => {
    return response.status(404).json({
      error: {
        code: "RouteNotFound",
        message: "Route Not Found",
      },
      metadata: {
        statusCode: 404,
        resource: request.url,
        timestamp: new Date().toString(),
      },
    });
  });

  return {
    app,
  };
};

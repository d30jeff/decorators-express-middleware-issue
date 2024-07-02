import {
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from "@/interfaces/express.interface.js";
import { Controller, Get, Next, Request, Response } from "@decorators/express";

@Controller("/cats")
export class CatController {
  @Get("/")
  async list(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
    @Next() next: ExpressNextFunction
  ) {
    try {
      throw new Error('Nope')
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

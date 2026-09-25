import type {
  NextFunction,
  Request,
  Response
} from 'express';

import type {
  ZodType
} from 'zod';

import {
  AppError
} from '../shared/AppError.js';


export const validateBody =
  (schema: ZodType) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {

    const result =
      schema.safeParse(req.body);

    if (!result.success) {

      next(
        new AppError(
          400,
          'VALIDATION_ERROR',
          'El cuerpo de la solicitud contiene datos inválidos',
          result.error.flatten()
        )
      );

      return;
    }

    req.body = result.data;

    next();
  };


export const validateParams =
  (schema: ZodType) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {

    const result =
      schema.safeParse(req.params);

    if (!result.success) {

      next(
        new AppError(
          400,
          'VALIDATION_ERROR',
          'Los parámetros de la solicitud son inválidos',
          result.error.flatten()
        )
      );

      return;
    }

    next();
  };
import type {
  ErrorRequestHandler
} from 'express';

import {
  AppError
} from '../shared/AppError.js';


export const errorHandler:
ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {

  if (err instanceof AppError) {

    res
      .status(err.statusCode)
      .json({
        success: false,
        error: {
          code: err.code,
          message: err.message,
          details: err.details ?? null
        }
      });

    return;
  }


  console.error(
    'Error no controlado:',
    err
  );


  res
    .status(500)
    .json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message:
          'Ocurrió un error interno en el servidor'
      }
    });
};
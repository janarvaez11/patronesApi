import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import type {
  EmployeeController
} from './controllers/empleados.controllers.js';

import {
  createEmployeeRouter
} from './routes/empleados.routes.js';

import {
  errorHandler
} from './middleware/error.middleware.js';

import {
  AppError
} from './shared/AppError.js';

import {
  sendSuccess
} from './shared/api-response.js';


export const createApp = (
  employeeController: EmployeeController
) => {

  const app = express();


  app.use(cors());

  app.use(morgan('dev'));

  app.use(express.json());


  app.get(
    '/health',
    (_req, res) => {

      sendSuccess(
        res,
        200,
        'Servicio disponible',
        {
          service:
            'employee-api'
        }
      );
    }
  );


  app.use(
    '/api/v1',
    createEmployeeRouter(
      employeeController
    )
  );


  app.use(
    (_req, _res, next) => {

      next(
        new AppError(
          404,
          'ROUTE_NOT_FOUND',
          'La ruta solicitada no existe'
        )
      );
    }
  );


  app.use(
    errorHandler
  );


  return app;
};
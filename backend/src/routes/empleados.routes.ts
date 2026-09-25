import {
  Router
} from 'express';

import type {
  EmployeeController
} from '../controllers/empleados.controllers.js';

import {
  validateBody,
  validateParams
} from '../middleware/validate.middleware.js';

import {
  createEmployeeSchema,
  employeeIdParamsSchema,
  updateEmployeeSchema
} from '../dto/employee.dto.js';


export const createEmployeeRouter = (
  controller: EmployeeController
): Router => {

  const router = Router();


  router.get(
    '/empleados',
    controller.getEmployees
  );


  router.get(
    '/empleados/:id',
    validateParams(
      employeeIdParamsSchema
    ),
    controller.getEmployeeById
  );


  router.post(
    '/empleados',
    validateBody(
      createEmployeeSchema
    ),
    controller.addEmployee
  );


  router.put(
    '/empleados/:id',
    validateParams(
      employeeIdParamsSchema
    ),
    validateBody(
      updateEmployeeSchema
    ),
    controller.updateEmployee
  );


  router.delete(
    '/empleados/:id',
    validateParams(
      employeeIdParamsSchema
    ),
    controller.deleteEmployee
  );


  return router;
};
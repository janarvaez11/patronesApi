import type {
  NextFunction,
  Request,
  Response
} from 'express';

import type {
  IEmployeeRepository
} from '../repositories/IEmployeeRepository.js';

import type {
  CreateEmployeeDto,
  EmployeeIdParams,
  UpdateEmployeeDto
} from '../dto/employee.dto.js';

import {
  AppError
} from '../shared/AppError.js';

import {
  sendSuccess
} from '../shared/api-response.js';


export class EmployeeController {

  constructor(
    private readonly repository:
      IEmployeeRepository
  ) {}


  getEmployees = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {

    try {

      const employees =
        await this.repository.findAll();

      sendSuccess(
        res,
        200,
        'Empleados consultados correctamente',
        employees
      );

    } catch (error) {

      next(error);
    }
  };


  getEmployeeById = async (
    req: Request<EmployeeIdParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {

    try {

      const employee =
        await this.repository.findById(
          req.params.id
        );

      if (!employee) {

        throw new AppError(
          404,
          'EMPLOYEE_NOT_FOUND',
          'Empleado no encontrado'
        );
      }

      sendSuccess(
        res,
        200,
        'Empleado consultado correctamente',
        employee
      );

    } catch (error) {

      next(error);
    }
  };


  addEmployee = async (
    req: Request<
      Record<string, never>,
      unknown,
      CreateEmployeeDto
    >,
    res: Response,
    next: NextFunction
  ): Promise<void> => {

    try {

      const employee =
        await this.repository.create(
          req.body
        );

      sendSuccess(
        res,
        201,
        'Empleado creado correctamente',
        employee
      );

    } catch (error) {

      next(error);
    }
  };


  updateEmployee = async (
    req: Request<
      EmployeeIdParams,
      unknown,
      UpdateEmployeeDto
    >,
    res: Response,
    next: NextFunction
  ): Promise<void> => {

    try {

      const employee =
        await this.repository.update(
          req.params.id,
          req.body
        );

      if (!employee) {

        throw new AppError(
          404,
          'EMPLOYEE_NOT_FOUND',
          'Empleado no encontrado'
        );
      }

      sendSuccess(
        res,
        200,
        'Empleado actualizado correctamente',
        employee
      );

    } catch (error) {

      next(error);
    }
  };


  deleteEmployee = async (
    req: Request<EmployeeIdParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {

    try {

      const deleted =
        await this.repository.delete(
          req.params.id
        );

      if (!deleted) {

        throw new AppError(
          404,
          'EMPLOYEE_NOT_FOUND',
          'Empleado no encontrado'
        );
      }

      sendSuccess(
        res,
        200,
        'Empleado eliminado correctamente',
        null
      );

    } catch (error) {

      next(error);
    }
  };
}
import {
  beforeEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals';

import type {
  NextFunction,
  Request,
  Response
} from 'express';

import {
  EmployeeController
} from './empleados.controllers.js';

import type {
  IEmployeeRepository
} from '../repositories/IEmployeeRepository.js';

import type {
  Employee
} from '../domain/employee.js';

import type {
  CreateEmployeeDto,
  EmployeeIdParams,
  UpdateEmployeeDto
} from '../dto/employee.dto.js';

import {
  AppError
} from '../shared/AppError.js';


describe(
  'EmployeeController - Mantenibilidad y Testabilidad',
  () => {

    let controller: EmployeeController;

    let mockRepository:
      jest.Mocked<IEmployeeRepository>;

    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
    let nextMock: jest.Mock;


    const fakeEmployee: Employee = {
      id: '507f1f77bcf86cd799439011',
      nombre: 'Andrés Mendoza',
      cargo: 'Arquitecto',
      departamento: 'TI',
      sueldo: 4000
    };


    beforeEach(() => {

      mockRepository = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      };


      controller =
        new EmployeeController(
          mockRepository
        );


      jsonMock = jest.fn();

      statusMock =
        jest.fn(() => ({
          json: jsonMock
        }));

      nextMock = jest.fn();
    });


    // =====================================================
    // PRUEBAS POSITIVAS
    // =====================================================

    it(
      'POSITIVA 1 - Debe retornar 200 y la lista de empleados',
      async () => {

        const fakeEmployees: Employee[] = [
          fakeEmployee
        ];


        mockRepository
          .findAll
          .mockResolvedValue(
            fakeEmployees
          );


        const request =
          {} as Request;


        const response = {
          status: statusMock
        } as unknown as Response;


        await controller.getEmployees(
          request,
          response,
          nextMock as NextFunction
        );


        expect(
          mockRepository.findAll
        ).toHaveBeenCalledTimes(1);


        expect(
          statusMock
        ).toHaveBeenCalledWith(200);


        expect(
          jsonMock
        ).toHaveBeenCalledWith({
          success: true,
          message:
            'Empleados consultados correctamente',
          data: fakeEmployees
        });


        expect(
          nextMock
        ).not.toHaveBeenCalled();
      }
    );


    it(
      'POSITIVA 2 - Debe retornar 200 al consultar un empleado existente',
      async () => {

        mockRepository
          .findById
          .mockResolvedValue(
            fakeEmployee
          );


        const request = {
          params: {
            id: fakeEmployee.id
          }
        } as Request<EmployeeIdParams>;


        const response = {
          status: statusMock
        } as unknown as Response;


        await controller.getEmployeeById(
          request,
          response,
          nextMock as NextFunction
        );


        expect(
          mockRepository.findById
        ).toHaveBeenCalledWith(
          fakeEmployee.id
        );


        expect(
          statusMock
        ).toHaveBeenCalledWith(200);


        expect(
          jsonMock
        ).toHaveBeenCalledWith({
          success: true,
          message:
            'Empleado consultado correctamente',
          data: fakeEmployee
        });


        expect(
          nextMock
        ).not.toHaveBeenCalled();
      }
    );


    it(
      'POSITIVA 3 - Debe crear un empleado y retornar 201',
      async () => {

        const createDto: CreateEmployeeDto = {
          nombre: 'Andrés Mendoza',
          cargo: 'Arquitecto',
          departamento: 'TI',
          sueldo: 4000
        };


        mockRepository
          .create
          .mockResolvedValue(
            fakeEmployee
          );


        const request = {
          body: createDto
        } as Request<
          Record<string, never>,
          unknown,
          CreateEmployeeDto
        >;


        const response = {
          status: statusMock
        } as unknown as Response;


        await controller.addEmployee(
          request,
          response,
          nextMock as NextFunction
        );


        expect(
          mockRepository.create
        ).toHaveBeenCalledWith(
          createDto
        );


        expect(
          statusMock
        ).toHaveBeenCalledWith(201);


        expect(
          jsonMock
        ).toHaveBeenCalledWith({
          success: true,
          message:
            'Empleado creado correctamente',
          data: fakeEmployee
        });


        expect(
          nextMock
        ).not.toHaveBeenCalled();
      }
    );

    it(
      'POSITIVA 4 - Debe actualizar un empleado existente y retornar 200',
      async () => {

        const employeeId =
          fakeEmployee.id;

        const updateDto: UpdateEmployeeDto = {
          cargo: 'Arquitecto Senior',
          sueldo: 4500
        };

        const updatedEmployee: Employee = {
          ...fakeEmployee,
          cargo: 'Arquitecto Senior',
          sueldo: 4500
        };


        mockRepository
          .update
          .mockResolvedValue(
            updatedEmployee
          );


        const request = {
          params: {
            id: employeeId
          },
          body: updateDto
        } as Request<
          EmployeeIdParams,
          unknown,
          UpdateEmployeeDto
        >;


        const response = {
          status: statusMock
        } as unknown as Response;


        await controller.updateEmployee(
          request,
          response,
          nextMock as NextFunction
        );


        expect(
          mockRepository.update
        ).toHaveBeenCalledWith(
          employeeId,
          updateDto
        );


        expect(
          statusMock
        ).toHaveBeenCalledWith(200);


        expect(
          jsonMock
        ).toHaveBeenCalledWith({
          success: true,
          message:
            'Empleado actualizado correctamente',
          data: updatedEmployee
        });


        expect(
          nextMock
        ).not.toHaveBeenCalled();
      }
    );


    it(
    'POSITIVA 5 - Debe eliminar un empleado existente y retornar 200',
    async () => {

      const employeeId =
        fakeEmployee.id;


      mockRepository
        .delete
        .mockResolvedValue(true);


      const request = {
        params: {
          id: employeeId
        }
      } as Request<EmployeeIdParams>;


      const response = {
        status: statusMock
      } as unknown as Response;


      await controller.deleteEmployee(
        request,
        response,
        nextMock as NextFunction
      );


      expect(
        mockRepository.delete
      ).toHaveBeenCalledWith(
        employeeId
      );


      expect(
        statusMock
      ).toHaveBeenCalledWith(200);


      expect(
        jsonMock
      ).toHaveBeenCalledWith({
        success: true,
        message:
          'Empleado eliminado correctamente',
        data: null
      });


      expect(
        nextMock
      ).not.toHaveBeenCalled();
    }
  );


    // =====================================================
    // PRUEBAS NEGATIVAS
    // =====================================================

    it(
      'NEGATIVA 1 - Debe generar 404 si el empleado consultado no existe',
      async () => {

        const employeeId =
          'aaaaaaaaaaaaaaaaaaaaaaaa';


        mockRepository
          .findById
          .mockResolvedValue(null);


        const request = {
          params: {
            id: employeeId
          }
        } as Request<EmployeeIdParams>;


        const response = {
          status: statusMock
        } as unknown as Response;


        await controller.getEmployeeById(
          request,
          response,
          nextMock as NextFunction
        );


        expect(
          mockRepository.findById
        ).toHaveBeenCalledWith(
          employeeId
        );


        expect(
          nextMock
        ).toHaveBeenCalledTimes(1);


        const error =
          nextMock.mock.calls[0]?.[0];


        expect(
          error
        ).toBeInstanceOf(AppError);


        if (!(error instanceof AppError)) {
          throw new Error(
            'Se esperaba una instancia de AppError'
          );
        }


        expect(
          error.statusCode
        ).toBe(404);


        expect(
          error.code
        ).toBe(
          'EMPLOYEE_NOT_FOUND'
        );


        expect(
          statusMock
        ).not.toHaveBeenCalled();
      }
    );


    it(
      'NEGATIVA 2 - Debe generar 404 al actualizar un empleado inexistente',
      async () => {

        const employeeId =
          'aaaaaaaaaaaaaaaaaaaaaaaa';


        const updateDto: UpdateEmployeeDto = {
          cargo: 'Arquitecto Senior'
        };


        mockRepository
          .update
          .mockResolvedValue(null);


        const request = {
          params: {
            id: employeeId
          },
          body: updateDto
        } as Request<
          EmployeeIdParams,
          unknown,
          UpdateEmployeeDto
        >;


        const response = {
          status: statusMock
        } as unknown as Response;


        await controller.updateEmployee(
          request,
          response,
          nextMock as NextFunction
        );


        expect(
          mockRepository.update
        ).toHaveBeenCalledWith(
          employeeId,
          updateDto
        );


        expect(
          nextMock
        ).toHaveBeenCalledTimes(1);


        const error =
          nextMock.mock.calls[0]?.[0];


        expect(
          error
        ).toBeInstanceOf(AppError);


        if (!(error instanceof AppError)) {
          throw new Error(
            'Se esperaba una instancia de AppError'
          );
        }


        expect(
          error.statusCode
        ).toBe(404);


        expect(
          error.code
        ).toBe(
          'EMPLOYEE_NOT_FOUND'
        );


        expect(
          statusMock
        ).not.toHaveBeenCalled();
      }
    );


    it(
      'NEGATIVA 3 - Debe generar 404 al eliminar un empleado inexistente',
      async () => {

        const employeeId =
          'aaaaaaaaaaaaaaaaaaaaaaaa';


        mockRepository
          .delete
          .mockResolvedValue(false);


        const request = {
          params: {
            id: employeeId
          }
        } as Request<EmployeeIdParams>;


        const response = {
          status: statusMock
        } as unknown as Response;


        await controller.deleteEmployee(
          request,
          response,
          nextMock as NextFunction
        );


        expect(
          mockRepository.delete
        ).toHaveBeenCalledWith(
          employeeId
        );


        expect(
          nextMock
        ).toHaveBeenCalledTimes(1);


        const error =
          nextMock.mock.calls[0]?.[0];


        expect(
          error
        ).toBeInstanceOf(AppError);


        if (!(error instanceof AppError)) {
          throw new Error(
            'Se esperaba una instancia de AppError'
          );
        }


        expect(
          error.statusCode
        ).toBe(404);


        expect(
          error.code
        ).toBe(
          'EMPLOYEE_NOT_FOUND'
        );


        expect(
          statusMock
        ).not.toHaveBeenCalled();
      }
    );

    it(
      'NEGATIVA 4 - Debe delegar el error si falla el repositorio al consultar',
      async () => {

        const repositoryError =
          new Error(
            'Error simulado de persistencia'
          );


        mockRepository
          .findAll
          .mockRejectedValue(
            repositoryError
          );


        const request =
          {} as Request;


        const response = {
          status: statusMock
        } as unknown as Response;


        await controller.getEmployees(
          request,
          response,
          nextMock as NextFunction
        );


        expect(
          mockRepository.findAll
        ).toHaveBeenCalledTimes(1);


        expect(
          nextMock
        ).toHaveBeenCalledWith(
          repositoryError
        );


        expect(
          statusMock
        ).not.toHaveBeenCalled();
      }
    );    

 
    it(
      'NEGATIVA 5 - Debe delegar el error si falla el repositorio al crear',
      async () => {

        const repositoryError =
          new Error(
            'Error simulado al crear empleado'
          );


        const createDto: CreateEmployeeDto = {
          nombre: 'Andrés Mendoza',
          cargo: 'Arquitecto',
          departamento: 'TI',
          sueldo: 4000
        };


        mockRepository
          .create
          .mockRejectedValue(
            repositoryError
          );


        const request = {
          body: createDto
        } as Request<
          Record<string, never>,
          unknown,
          CreateEmployeeDto
        >;


        const response = {
          status: statusMock
        } as unknown as Response;


        await controller.addEmployee(
          request,
          response,
          nextMock as NextFunction
        );


        expect(
          mockRepository.create
        ).toHaveBeenCalledWith(
          createDto
        );


        expect(
          nextMock
        ).toHaveBeenCalledWith(
          repositoryError
        );


        expect(
          statusMock
        ).not.toHaveBeenCalled();
      }
    );    



  }
);
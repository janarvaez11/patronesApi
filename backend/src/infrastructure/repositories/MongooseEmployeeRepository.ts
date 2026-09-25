import type {
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData
} from '../../domain/employee.js';

import type {
  IEmployeeRepository
} from '../../repositories/IEmployeeRepository.js';

import {
  EmployeeModel
} from '../models/employee.model.js';


export class MongooseEmployeeRepository
  implements IEmployeeRepository {

  async findAll(): Promise<Employee[]> {

    const employees =
      await EmployeeModel.find();

    return employees.map(employee => ({
      id: employee._id.toString(),
      nombre: employee.nombre,
      cargo: employee.cargo,
      departamento: employee.departamento,
      sueldo: employee.sueldo,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    }));
  }


  async findById(
    id: string
  ): Promise<Employee | null> {

    const employee =
      await EmployeeModel.findById(id);

    if (!employee) {
      return null;
    }

    return {
      id: employee._id.toString(),
      nombre: employee.nombre,
      cargo: employee.cargo,
      departamento: employee.departamento,
      sueldo: employee.sueldo,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    };
  }


  async create(
    data: CreateEmployeeData
  ): Promise<Employee> {

    const employee =
      await EmployeeModel.create(data);

    return {
      id: employee._id.toString(),
      nombre: employee.nombre,
      cargo: employee.cargo,
      departamento: employee.departamento,
      sueldo: employee.sueldo,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    };
  }


  async update(
    id: string,
    data: UpdateEmployeeData
  ): Promise<Employee | null> {

    const employee =
      await EmployeeModel.findByIdAndUpdate(
        id,
        data,
        {
          returnDocument: 'after'
        }
      );

    if (!employee) {
      return null;
    }

    return {
      id: employee._id.toString(),
      nombre: employee.nombre,
      cargo: employee.cargo,
      departamento: employee.departamento,
      sueldo: employee.sueldo,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    };
  }


  async delete(
    id: string
  ): Promise<boolean> {

    const result =
      await EmployeeModel.findByIdAndDelete(id);

    return result !== null;
  }
}
export interface Employee {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateEmployeeData = Omit<
  Employee,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateEmployeeData = {
  [K in keyof CreateEmployeeData]?:
    CreateEmployeeData[K] | undefined;
};
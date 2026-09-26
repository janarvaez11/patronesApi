export interface Employee {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeePayload {
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
}

export type UpdateEmployeePayload = Partial<EmployeePayload>;

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

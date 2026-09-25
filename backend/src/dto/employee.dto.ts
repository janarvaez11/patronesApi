import { z } from 'zod';


export const employeeIdParamsSchema = z.object({
  id: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      'El ID debe ser un ObjectId válido de MongoDB'
    )
});


export const createEmployeeSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede superar 100 caracteres'),

    cargo: z
      .string()
      .trim()
      .min(2, 'El cargo debe tener al menos 2 caracteres')
      .max(100, 'El cargo no puede superar 100 caracteres'),

    departamento: z
      .string()
      .trim()
      .min(2, 'El departamento debe tener al menos 2 caracteres')
      .max(100, 'El departamento no puede superar 100 caracteres'),

    sueldo: z
      .number()
      .finite('El sueldo debe ser un número válido')
      .nonnegative('El sueldo no puede ser negativo')
  })
  .strict();


export const updateEmployeeSchema =
  createEmployeeSchema
    .partial()
    .refine(
      data => Object.keys(data).length > 0,
      {
        message:
          'Debe enviar al menos un campo para actualizar'
      }
    );


export type EmployeeIdParams =
  z.infer<typeof employeeIdParamsSchema>;

export type CreateEmployeeDto =
  z.infer<typeof createEmployeeSchema>;

export type UpdateEmployeeDto =
  z.infer<typeof updateEmployeeSchema>;
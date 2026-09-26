# Frontend Angular - Gestión de Empleados

Frontend Angular standalone basado en componentes para completar los Retos 3 y 4 de la práctica MEAN.

## Arquitectura

- `EmployeePageComponent`: Smart Component / orquestador.
- `EmployeeFormComponent`: Dumb Component, solo recibe datos y emite eventos.
- `EmployeeListComponent`: Dumb Component, recibe empleados y emite editar/eliminar.
- `EmployeeService`: consumo HTTP y estado reactivo mediante `BehaviorSubject` + `Observable`.

## Requisitos

Angular 22 requiere una versión compatible de Node.js. Con Node 24.15+ funciona correctamente.

## Ejecución local

1. Levantar el backend en `http://localhost:3000`.
2. En esta carpeta:

```bash
npm install
npm start
```

3. Abrir `http://localhost:4200`.

La URL del backend está definida en `src/environments/environment.ts`.

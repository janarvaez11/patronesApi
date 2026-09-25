import 'dotenv/config';

import {
  connectDatabase
} from './config/database.js';

import {
  MongooseEmployeeRepository
} from './infrastructure/repositories/MongooseEmployeeRepository.js';

import {
  EmployeeController
} from './controllers/empleados.controllers.js';

import {
  createApp
} from './app.js';


const bootstrap = async (): Promise<void> => {

  await connectDatabase();


  const employeeRepository =
    new MongooseEmployeeRepository();


  const employeeController =
    new EmployeeController(
      employeeRepository
    );


  const app =
    createApp(
      employeeController
    );


  const port =
    Number(process.env.PORT) || 3000;


  app.listen(
    port,
    () => {

      console.log(
        `🚀 API escuchando en http://localhost:${port}`
      );
    }
  );
};


bootstrap();
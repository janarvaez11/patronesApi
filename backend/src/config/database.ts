import mongoose from 'mongoose';


export const connectDatabase =
async (): Promise<void> => {

  const mongoUri =
    process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      'La variable MONGO_URI no está configurada'
    );
  }

  try {

    await mongoose.connect(mongoUri);

    console.log(
      '✅ [Database] Conexión exitosa a MongoDB Atlas'
    );

  } catch (error) {

    console.error(
      '❌ Error crítico al conectar a MongoDB Atlas:',
      error
    );

    process.exit(1);
  }
};
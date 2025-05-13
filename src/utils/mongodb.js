import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  // Si ya hay una conexión, la reutilizamos
  if (cached.conn) {
    console.log("✅ Usando la conexión existente a MongoDB");
    return cached.conn;
  }

  // Si no hay una conexión activa, la creamos
  if (!cached.promise) {
    console.log("🔄 Conectando a MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
      .then((mongooseInstance) => {
        console.log("✅ Conexión exitosa a MongoDB");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("🔥 Error al conectar con MongoDB:", error);
        throw new Error("Error al conectar con MongoDB");
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
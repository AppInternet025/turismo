import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Asegúrate de tener esta variable de entorno configurada
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export default async function handler(req, res) {
  let client;

  try {
    client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB); // Asegúrate de tener esta variable de entorno configurada para el nombre de la base de datos
    const routesCollection = db.collection('routes');

    if (req.method === 'POST') {
      const { name, coordinates } = req.body;
      const result = await routesCollection.insertOne({ name, coordinates });
      res.status(201).json({ message: 'Ruta guardada correctamente', id: result.insertedId });
    } else if (req.method === 'GET') {
      const routes = await routesCollection.find({}).toArray();
      res.status(200).json(routes);
    } else {
      res.status(405).json({ message: 'Método no permitido' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error del servidor' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
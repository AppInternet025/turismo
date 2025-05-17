import { connectToDatabase } from "@/utils/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: "Contraseña incorrecta" }), { status: 401 });
  }

  console.log(`El usuario ${email} se ha logueado correctamente`);
  return new Response(JSON.stringify({ message: "Login exitoso" }), { status: 200 });
}

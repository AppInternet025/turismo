import { connectToDatabase } from "@/utils/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// API route para Next.js con App Router (no usa req.method)
export async function POST(req) {
  try {
    const { username, email, password, confirmPassword } = await req.json();

    if (!username || !email || !password || !confirmPassword) {
      return Response.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return Response.json({ message: "Las contraseñas deben coincidir" }, { status: 400 });
    }

    await connectToDatabase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return Response.json({ message: "Usuario ya registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return Response.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("🔥 Error en /api/usuario:", error);
    return Response.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
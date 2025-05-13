"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/localLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json(); // ✅ leer el cuerpo de la respuesta

      if (!res.ok) {
        throw new Error(data.message || "Error en la autenticación"); // ✅ usar mensaje de backend
      }

      router.push("/principal"); // Redirige tras login exitoso
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-8 border rounded-lg shadow-lg bg-white"
      >
        <h2 className="text-xl font-semibold">Iniciar sesión</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          Iniciar sesión
        </button>

        <button
          type="button"
          className="w-full py-2 bg-gray-200 text-blue-700 rounded hover:bg-gray-300"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

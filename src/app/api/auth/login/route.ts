import { NextResponse } from "next/server";
import { hashPasswordSecure } from "../../../../lib/server-utils";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    if (!password) {
      return NextResponse.json({ error: "Contraseña es requerida" }, { status: 400 });
    }
    
    // Ejecutamos la criptografía del lado del servidor para no exponer el algoritmo en el bundle del cliente
    const hash = hashPasswordSecure(password);
    
    return NextResponse.json({ hash });
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor de autenticación" }, { status: 500 });
  }
}

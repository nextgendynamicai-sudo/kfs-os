import { NextResponse } from "next/server";
import { hashPasswordSecure } from "../../../../lib/server-utils";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    if (!password) {
      return NextResponse.json({ error: "Contraseña es requerida" }, { status: 400 });
    }
    
    // Hash generado en el servidor durante el registro para proteger el algoritmo KFS
    const hash = hashPasswordSecure(password);
    
    return NextResponse.json({ hash });
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor de registro" }, { status: 500 });
  }
}

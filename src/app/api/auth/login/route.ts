import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

const SECRET_KEY = process.env.JWT_SECRET_KEY || "key-not-found";

export async function POST(req: Request) {
  try {
    const { cpf, password } = await req.json();

    if (!cpf) {
      return NextResponse.json(
        { message: "CPF é obrigatório" },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { message: "Senha é obrigatória" },
        { status: 400 }
      );
    }

    const user = await prisma.users_clients.findUnique({
      where: {
        cpf: cpf, 
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "CPF incorreto" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "CPF ou senha incorretos" },
        { status: 401 }
      );
    }

    const tokenPayload = {
      id: user.id,
      cpf: user.cpf,
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: "1h" });

    return NextResponse.json(
      { 
        token, 
        id: user.id, // Enviando o ID do usuário também
        message: "Login realizado com sucesso!" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { message: "Erro no servidor" },
      { status: 500 }
    );
  }
}

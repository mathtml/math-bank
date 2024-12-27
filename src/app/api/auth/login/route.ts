import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ajuste o caminho conforme necessário

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key"; // Defina sua chave secreta para o JWT

export async function POST(req: Request) {
  try {
    // Parseia o corpo da requisição
    const { cpf, password } = await req.json();

    // Validação dos parâmetros
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

    // Verifica se o usuário existe no banco com CPF
    const user = await prisma.users_clients.findUnique({
      where: {
        cpf: cpf, // Busca pelo CPF
      },
    });

    // Verifica se o usuário foi encontrado
    if (!user) {
      return NextResponse.json(
        { message: "CPF incorreto" },
        { status: 401 }
      );
    }

    // Verifica se a senha está correta usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "CPF ou senha incorretos" },
        { status: 401 }
      );
    }

    // Geração do token JWT com payload adequado
    const tokenPayload = {
      id: user.id,
      cpf: user.cpf,
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: "1h" });

    // Retorna o token e a mensagem de sucesso
    return NextResponse.json(
      { token, message: "Login realizado com sucesso!" },
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

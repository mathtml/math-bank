import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs'; 
import { NextResponse } from 'next/server';

type Currency = {
  id: number;
  code: string;
  name: string | null;
  symbol: string | null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, e_mail, password, cpf, dateborn } = body;

    if (!name || !e_mail || !password || !cpf || !dateborn) {
      return NextResponse.json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' }, { status: 400 });
    }

    const existingUser = await prisma.users_clients.findFirst({
      where: {
        OR: [
          { cpf: cpf },
          { e_mail: e_mail }
        ]
      }
    });

    if (existingUser) {
      const duplicateField = existingUser.cpf === cpf && existingUser.e_mail === e_mail
        ? 'CPF e e-mail'
        : existingUser.cpf === cpf
        ? 'CPF'
        : 'e-mail';
    
      return NextResponse.json(
        { error: `${duplicateField} já está cadastrado.` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users_clients.create({
      data: {
        name,
        e_mail,
        password: hashedPassword,
        cpf,
        dateborn: new Date(dateborn),
      }
    });

    const currencies = await prisma.currencies.findMany();

    if (currencies.length === 0) {
      return NextResponse.json({ error: 'Nenhuma moeda disponível para criar carteiras.' }, { status: 400 });
    }

    const wallets = currencies.map((currency: Currency) => ({
      user_id: newUser.id,
      currency_id: currency.id,
      balance: (0.00).toFixed(2),
    }));

    await prisma.wallet_clients.createMany({
      data: wallets
    });

    return NextResponse.json({ message: 'Usuário e carteiras criados com sucesso.' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar o usuário e a carteira.' }, { status: 500 });
  }
}

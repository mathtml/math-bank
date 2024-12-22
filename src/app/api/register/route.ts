import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs'; // Importa o bcrypt para fazer o hash da senha
import { NextResponse } from 'next/server';

type Currency = {
  id: number;
  code: string;
  name: string;
  symbol: string;
};

export async function POST(request: Request) {
    try {
      const body = await request.json();
  
      const { name, e_mail, password, cpf, dateborn } = body;
  
      // Verificar se os campos obrigatórios estão preenchidos
      if (!name || !e_mail || !password || !cpf || !dateborn) {
        return NextResponse.json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' }, { status: 400 });
      }
  
      // Verificar se o CPF ou e-mail já estão cadastrados
      const existingUser = await prisma.users_clients.findFirst({
        where: {
          OR: [
            { cpf: cpf },
            { e_mail: e_mail }
          ]
        }
      });
  
      if (existingUser) {
        return NextResponse.json({ error: 'CPF ou e-mail já estão cadastrados.' }, { status: 400 });
      }
  
      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Criar o novo usuário
      const newUser = await prisma.users_clients.create({
        data: {
          name,
          e_mail,
          password: hashedPassword,
          cpf,
          dateborn: new Date(dateborn),
        }
      });
  
      // Obter todas as moedas cadastradas
      const currencies = await prisma.currencies.findMany();
  
      // Verifique se as moedas foram encontradas
      if (currencies.length === 0) {
        return NextResponse.json({ error: 'Nenhuma moeda disponível para criar carteiras.' }, { status: 400 });
      }
  
      // Criar a carteira para cada moeda com o valor 0
      const wallets = currencies.map((currency: Currency) => ({
        user_id: newUser.id,
        currency_id: currency.id,
        balance: (0.00).toFixed(2),  // Força a formatação para 2 casas decimais
    }));
  
      // Inserir todas as carteiras
      await prisma.wallet_clients.createMany({
        data: wallets
      });
  
      // Retornar sucesso
      return NextResponse.json({ message: 'Usuário e carteiras criados com sucesso.', user: newUser }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Erro ao criar o usuário e a carteira.' }, { status: 500 });
    }
  }
  

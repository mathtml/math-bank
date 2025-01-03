import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Certifique-se de que o caminho para o Prisma está correto

export async function POST(req: Request) {
  try {
    // Lendo o corpo da requisição
    const { auth_id } = await req.json(); // Pega o auth_id enviado no corpo da requisição

    // Verifica se o auth_id foi fornecido
    if (!auth_id) {
      return NextResponse.json({ error: 'ID do usuário não fornecido' }, { status: 400 });
    }

    // Buscando o usuário com base no auth_id e incluindo as carteiras
    const userWithWallets = await prisma.users_clients.findUnique({
      where: { id: Number(auth_id) }, // Certifique-se de que o auth_id é um número
      include: {
        wallet_clients: {
          select: {
            id: true,
            balance: true,
            created_at: true,
            currencies: {
              select: {
                id: true,
                name: true,
                symbol: true,
              },
            },
          },
        },
      },
    });

    // Caso o usuário não seja encontrado
    if (!userWithWallets) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Retorna as carteiras do usuário
    return NextResponse.json({ wallet_clients: userWithWallets.wallet_clients });
  } catch (error) {
    // Caso ocorra qualquer outro erro
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar dados do usuário' }, { status: 500 });
  }
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TAXA_SELIC_ANUAL = 13.75;
const FATOR_DIARIO = Math.pow(1 + TAXA_SELIC_ANUAL / 100, 1 / 365) - 1;

export async function aumentarContas(): Promise<void> {
  try {
    const contas = await prisma.wallet_clients.findMany({
      where: {
        currency_id: 2, 
        balance: { gte: 100 },  
      },
    });

    for (const conta of contas) {
      const balance = conta.balance?.toNumber() ?? 0; 

      if (balance >= 100) {
        const novoSaldo = balance * (1 + FATOR_DIARIO);

        // Atualiza o saldo no banco de dados
        await prisma.wallet_clients.update({
          where: { id: conta.id },
          data: { balance: novoSaldo },
        });

        console.log(`Saldo da conta ${conta.id} atualizado para ${novoSaldo.toFixed(8)}`);
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar contas:', error);
  }
}

'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Card, CardContent, Typography, Grid, CircularProgress, Box, Button, 
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem 
} from '@mui/material';

interface Currency {
  id: number;
  name: string;
  symbol: string;
  rateToUSD: number; // Cotação em relação ao dólar (USD)
}

interface Wallet {
  id: number;
  balance: any; // Ajustando para qualquer tipo (Decimal ou number)
  created_at: string;
  currencies: Currency;
}

const WalletPage: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [conversionValue, setConversionValue] = useState<number>(0);
  const [targetCurrency, setTargetCurrency] = useState<Currency | null>(null);
  const [receivedValue, setReceivedValue] = useState<number>(0);
  const router = useRouter();

  const checkAuth = () => {
    const authToken = localStorage.getItem('auth_token');
    const authId = localStorage.getItem('auth_id');
    if (!authToken || !authId) return { token: null, userId: null };
    return { token: authToken, userId: authId };
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_id');
    router.push('/'); // Redireciona para a página inicial ou de login
  };

  const handleCardClick = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setTargetCurrency(null); // Reseta a moeda de destino ao abrir o diálogo
  };

  const handleDialogClose = () => {
    setSelectedWallet(null);
    setConversionValue(0);
    setTargetCurrency(null);
    setReceivedValue(0);
  };

  const handleConvert = () => {
    console.log(`Convertendo ${conversionValue} de ${selectedWallet?.currencies.name} para ${targetCurrency?.name}`);
    handleDialogClose();
  };

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const { token, userId } = checkAuth();

        if (!token || !userId) {
          router.push('/');
          return;
        }

        const response = await fetch('/api/user/getWallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auth_id: userId }),
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar as carteiras');
        }

        const data = await response.json();
        // Adicionando cotação fixa para cada moeda
        const walletsWithRates = data.wallet_clients.map((wallet: Wallet) => ({
          ...wallet,
          currencies: {
            ...wallet.currencies,
            rateToUSD: wallet.currencies.symbol === 'USD' ? 1 : wallet.currencies.symbol === 'EUR' ? 1.1 : 5.0,
          },
        }));

        setWallets(walletsWithRates);
      } catch (error) {
        setError('Erro ao carregar as carteiras');
        console.error('Erro ao carregar as carteiras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [router]);

  useEffect(() => {
    if (conversionValue > 0 && targetCurrency && selectedWallet) {
      const sourceRate = selectedWallet.currencies.rateToUSD;
      const targetRate = targetCurrency.rateToUSD;
      const convertedValue = (conversionValue / sourceRate) * targetRate;
      setReceivedValue(convertedValue);
    } else {
      setReceivedValue(0);
    }
  }, [conversionValue, targetCurrency, selectedWallet]);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />;

  if (error) return <Typography variant="h6" color="error" align="center">{error}</Typography>;

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Minhas Carteiras
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {wallets.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary">
            Você não tem carteiras registradas.
          </Typography>
        ) : (
          wallets.map((wallet) => (
            <Grid item key={wallet.id} xs={12} sm={6} md={4}>
              <Card
                variant="outlined"
                onClick={() => handleCardClick(wallet)}
                sx={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Saldo disponível:
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {wallet.currencies.symbol} {isNaN(Number(wallet.balance)) ? '0.00' : Number(wallet.balance).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Criada em: {new Date(wallet.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={!!selectedWallet} onClose={handleDialogClose}>
        <DialogTitle>Converter Moeda</DialogTitle>
        <DialogContent>
          <Typography>
            Você está convertendo {selectedWallet?.currencies.name} ({selectedWallet?.currencies.symbol}).
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Valor para conversão"
            value={conversionValue}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= Number(selectedWallet?.balance)) {
                setConversionValue(value);
              }
            }}
            helperText={`Saldo disponível: ${selectedWallet?.currencies.symbol} ${Number(selectedWallet?.balance).toFixed(2)}`}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Moeda de destino"
            value={targetCurrency?.id || ''}
            onChange={(e) => {
              const currencyId = Number(e.target.value);
              const selectedCurrency = wallets.find((w) => w.currencies.id === currencyId)?.currencies || null;
              setTargetCurrency(selectedCurrency);
            }}
            margin="normal"
          >
            {wallets
              .filter((w) => w.currencies.id !== selectedWallet?.currencies.id)
              .map((w) => (
                <MenuItem key={w.currencies.id} value={w.currencies.id}>
                  {w.currencies.name} ({w.currencies.symbol})
                </MenuItem>
              ))}
          </TextField>
          {receivedValue > 0 && (
            <Typography variant="h6" color="primary" sx={{ marginTop: '20px' }}>
              Você receberá: {targetCurrency?.symbol} {receivedValue.toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConvert} color="primary" disabled={!conversionValue || !targetCurrency}>
            Converter
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Sair
        </Button>
      </Box>
    </Box>
  );
};

export default WalletPage;

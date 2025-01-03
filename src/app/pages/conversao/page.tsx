'use client'
import React, { useState } from 'react';
import { TextField, MenuItem, Button, Typography, Box, Grid } from '@mui/material';

const moedas = ['USD', 'EUR', 'GBP', 'BRL'];

const ConversaoMoeda: React.FC = () => {
  const [valor, setValor] = useState<number | string>('');
  const [moedaOrigem, setMoedaOrigem] = useState<string>('USD');
  const [moedaDestino, setMoedaDestino] = useState<string>('BRL');
  const [valorConvertido, setValorConvertido] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(e.target.value);
  };

  const handleMoedaOrigemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoedaOrigem(e.target.value);
  };

  const handleMoedaDestinoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoedaDestino(e.target.value);
  };

  const handleConversao = async () => {
    if (!valor || isNaN(Number(valor))) {
      setErro('Por favor, insira um valor válido');
      return;
    }
    setErro(null);
    setLoading(true);
  
    try {
      const response = await fetch('/api/conversao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: Number(valor),
          moedaOrigem,
          moedaDestino,
          auth_id: 1,  // Id do usuário, você deve substituir por algo dinâmico
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao realizar a conversão');
      }
  
      const data = await response.json();
      setValorConvertido(data.valorConvertido);
    } catch (error: unknown) {
      // Verifica se o erro é uma instância de Error antes de acessar message
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro('Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Conversão de Moeda</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Valor"
            variant="outlined"
            fullWidth
            value={valor}
            onChange={handleValorChange}
            type="number"
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Moeda de Origem"
            variant="outlined"
            fullWidth
            value={moedaOrigem}
            onChange={handleMoedaOrigemChange}
          >
            {moedas.map((moeda) => (
              <MenuItem key={moeda} value={moeda}>
                {moeda}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Moeda de Destino"
            variant="outlined"
            fullWidth
            value={moedaDestino}
            onChange={handleMoedaDestinoChange}
          >
            {moedas.map((moeda) => (
              <MenuItem key={moeda} value={moeda}>
                {moeda}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleConversao}
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Converter'}
          </Button>
        </Grid>
      </Grid>

      {erro && <Typography color="error" sx={{ marginTop: 2 }}>{erro}</Typography>}

      {valorConvertido !== null && !erro && (
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Valor convertido: {valorConvertido.toFixed(2)} {moedaDestino}
        </Typography>
      )}
    </Box>
  );
};

export default ConversaoMoeda;

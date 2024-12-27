import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const RegrasCdiRender = () => {
  return (
    <Box sx={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Regras para Rendimento de 100% do CDI
      </Typography>

      {/* O que é o CDI */}
      <Box sx={{ marginBottom: '1.5rem' }}>
        <Typography variant="h5" gutterBottom>
          O que é o CDI?
        </Typography>
        <Typography variant="body1">
          O <strong>CDI (Certificado de Depósito Interbancário)</strong> é uma taxa de referência utilizada entre bancos para 
          empréstimos de curtíssimo prazo. Ele é muito próximo da Taxa SELIC e serve como base para diversos 
          investimentos no mercado financeiro.
        </Typography>
      </Box>

      {/* Rendimento de 100% do CDI */}
      <Box sx={{ marginBottom: '1.5rem' }}>
        <Typography variant="h5" gutterBottom>
          Rendimento de 100% do CDI
        </Typography>
        <Typography variant="body1">
          Quando uma aplicação ou conta remunerada promete <strong>"rendimento de 100% do CDI"</strong>, isso significa que o valor investido terá 
          um retorno equivalente à taxa anual do CDI.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '1rem' }}>
          <em>Exemplo:</em> Se o CDI anual estiver em 13,75%, o rendimento bruto anual será de 13,75% sobre o valor aplicado.
        </Typography>
      </Box>

      {/* Regras Gerais */}
      <Box sx={{ marginBottom: '1.5rem' }}>
        <Typography variant="h5" gutterBottom>
          Regras Gerais para Render 100% do CDI
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Aplicação Automática: O saldo na conta deve estar disponível para que o rendimento automático ocorra diariamente." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Liquidez Diária: O dinheiro pode ser resgatado a qualquer momento, mas o rendimento é proporcional ao tempo investido." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Base de Cálculo Diária: O CDI é anual, mas o rendimento é calculado diariamente usando juros compostos." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Impostos Aplicados: O rendimento está sujeito ao Imposto de Renda e ao IOF (em resgates antes de 30 dias)." />
          </ListItem>
        </List>
      </Box>

      {/* Exemplo Prático */}
      <Box sx={{ marginBottom: '1.5rem' }}>
        <Typography variant="h5" gutterBottom>
          Como o Rendimento Funciona?
        </Typography>
        <Typography variant="body1">
          O rendimento é proporcional ao tempo que o dinheiro permanece investido. Se uma conta ou aplicação promete 
          100% do CDI, ela estará acompanhando a variação diária dessa taxa.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '1rem' }}>
          <em>Exemplo Prático:</em>
        </Typography>
        <Typography variant="body2" sx={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          Valor Inicial: R$ 1.000,00<br />
          CDI Anual: 13,75%<br />
          Tempo: 30 dias úteis<br />
          Rendimento Bruto Aproximado: R$ 11,05
        </Typography>
      </Box>

      {/* Benefícios */}
      <Box sx={{ marginBottom: '1.5rem' }}>
        <Typography variant="h5" gutterBottom>
          Benefícios de 100% do CDI
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Maior que a Poupança: Rendimento superior ao da poupança." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Liquidez e Segurança: O dinheiro pode ser resgatado a qualquer momento." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Sem Necessidade de Aportes: O saldo começa a render automaticamente." />
          </ListItem>
        </List>
      </Box>

      {/* Impostos e Taxas */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Atenção para Impostos e Taxas
        </Typography>
        <Typography variant="body1">
          <strong>Imposto de Renda:</strong> Incide sobre os rendimentos, com alíquotas regressivas dependendo do tempo de aplicação:
        </Typography>
        <List sx={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <ListItem>
            <ListItemText primary="Até 180 dias: 22,5%" />
          </ListItem>
          <ListItem>
            <ListItemText primary="De 181 a 360 dias: 20%" />
          </ListItem>
          <ListItem>
            <ListItemText primary="De 361 a 720 dias: 17,5%" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Acima de 720 dias: 15%" />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ marginTop: '1rem' }}>
          <strong>IOF:</strong> Cobrado apenas em resgates feitos antes de 30 dias.
        </Typography>
      </Box>
    </Box>
  );
};

export default RegrasCdiRender;

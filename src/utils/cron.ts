import cron from 'node-cron';
import { aumentarContas } from '../app/api/schedule/taxaselic/taxaselic';

cron.schedule('* * * * *', async () => {
    console.log('Cron job iniciado: ', new Date());  
    await aumentarContas();  
    console.log('Cron job finalizado: ', new Date());  
  });
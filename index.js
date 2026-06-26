import 'dotenv/config';

import { app } from './src/app.js'; // Importa a instância do aplicativo Express

// Inicia o servidor na porta 8080
app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:' + process.env.PORT);
});

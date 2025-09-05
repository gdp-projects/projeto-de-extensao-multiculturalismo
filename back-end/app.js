import express from 'express';
import dotenv from 'dotenv';
import pool from './src/config/db/postgreSQL.js'; 
import usuarios from './src/routes/usuariosRoutes.js';
const app = express();
const PORT = 8080;

pool.connect()
  .then(() => {
    console.log('Conectado ao banco de dados PostgreSQL');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados PostgreSQL', err);
  });

dotenv.config();

app.use('/usuarios', usuarios);


app.listen(PORT, () => {
  console.log(`Server rodando, http://localhost:${PORT}`);
});
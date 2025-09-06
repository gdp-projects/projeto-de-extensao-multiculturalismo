import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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

// Configuração do CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: "*"
}));

app.use(express.json());

app.use('/usuarios', usuarios);

app.listen(PORT, () => {
  console.log(`Server rodando, http://localhost:${PORT}`);
});
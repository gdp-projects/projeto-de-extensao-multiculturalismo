import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './src/config/db/postgreSQL.js'; 
import usuarios from './src/routes/usuariosRoutes.js';
import eventos from './src/routes/eventosRoutes.js';

// Carrega as variáveis de ambiente primeiro
dotenv.config();

const app = express();
const PORT = 8080;

// Configuração do CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

// Middlewares para o Express entender JSON
app.use(express.json());

// Middlewares para o Express entender formulários
app.use(express.urlencoded({ extended: true }));


// Usar as rotas
app.use('/usuarios', usuarios);
app.use('/eventos', eventos);

// Conectar ao banco de dados e iniciar o servidor
pool.connect()
  .then(() => {
    console.log('Conectado ao banco de dados PostgreSQL');
    app.listen(PORT, () => {
      console.log(`Server rodando, http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados PostgreSQL', err);
  });
import { Router } from 'express';
import eventosController from '../controllers/eventosController.js';
import usuariosMiddleware from '../middleware/usuariosMiddleware.js';

const router = Router();

// Criar evento
router.post('/', usuariosMiddleware.autenticarToken, usuariosMiddleware.autenticarOrganizador, eventosController.createEvento);

// Listar todos
router.get('/', eventosController.getEventos);

// Buscar por ID
router.get('/:id', eventosController.getEventoById);

// Buscar por nome
router.get('/', eventosController.getEventoByName)

export default router;

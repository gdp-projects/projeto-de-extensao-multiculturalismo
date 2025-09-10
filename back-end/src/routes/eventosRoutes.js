import { Router } from 'express';
import eventosController from '../controllers/eventosController.js';

const router = Router();

// Criar evento
router.post('/', eventosController.createEvento);

// Listar todos
router.get('/', eventosController.getEventos);

// Buscar por ID
router.get('/:id', eventosController.getEventoById);

export default router;

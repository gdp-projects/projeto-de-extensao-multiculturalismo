import { Router } from 'express';
import eventosController from '../controllers/eventosController.js';

const router = Router();

// Criar evento
router.post('/', eventosController.createEvento);

// Listar todos
router.get('/', eventosController.getEventos);

// Buscar por ID
router.get('/:id', eventosController.getEventoById);

//Deletar por ID
router.delete('/:id', eventosController.deleteEvento);

//Atualizar evento
router.put('/:id', eventosController.updateEvento);

export default router;

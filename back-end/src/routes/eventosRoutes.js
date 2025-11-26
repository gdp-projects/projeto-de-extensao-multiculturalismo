import { Router } from 'express';
import eventosController from '../controllers/eventosController.js';
import usuariosMiddleware from '../middleware/usuariosMiddleware.js';

const router = Router();

// Criar evento
router.post('/', usuariosMiddleware.autenticarToken, usuariosMiddleware.autenticarOrganizador, eventosController.createEvento, eventosController.addOrganizadorToEvento);

// Listar todos
router.get('/', eventosController.getEventos);

// Pesquisar eventos
router.get('/pesquisa', eventosController.pesquisarEventos);

// Buscar por ID
router.get('/:id', eventosController.getEventoById);

// Buscar por nome
router.get('/:nome', eventosController.getEventoByName)

// Listar evento por id do usuário
router.get("/usuario/:id_usuario", usuariosMiddleware.autenticarToken, eventosController.getEventoByUserId)

//Deletar por ID
router.delete('/:id', eventosController.deleteEvento);

//Atualizar evento
router.put('/:id', eventosController.updateEvento);

export default router;

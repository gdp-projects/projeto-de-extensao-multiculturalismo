import express from 'express'
import usuariosController from '../controllers/usuariosController.js'
import usuariosModel from '../models/usuariosModel.js';
import usuariosMiddleware from "../middleware/usuariosMiddleware.js"
const router = express.Router()

// Rota de ver usuários
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById)

// Rotas de criar, atualizar e deletar usuários
router.post('/', usuariosController.createUsuario)
// router.put('/:id', usuariosController.updateUsuario)
router.delete('/:id', usuariosMiddleware.autenticarToken, usuariosController.deleteUsuario)

// Rota para promover usuário a organizador
router.put('/promover-organizador/:id', usuariosController.promoverParaOrganizador)

// Rota para login de usuário
router.post('/login', usuariosController.loginUsuario)

export default router
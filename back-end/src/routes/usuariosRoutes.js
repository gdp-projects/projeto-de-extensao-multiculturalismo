import express from 'express'
import usuariosController from '../controllers/usuariosController.js'
import usuariosModel from '../models/usuariosModel.js';
const router = express.Router()

// Rota de ver usuários
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById)

// Rotas de criar, atualizar e deletar usuários
router.post('/', usuariosController.createUsuario)
// router.put('/:id', usuariosController.updateUsuario)
router.delete('/:id', usuariosController.deleteUsuario)

// Rota para login de usuário
router.post('/login', usuariosModel.loginUsuario)

export default router
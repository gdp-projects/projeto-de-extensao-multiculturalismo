import express from 'express'
import usuariosController from '../controllers/usuariosController.js'
const router = express.Router()

// Rota de ver usuários
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById)

// Rotas de criar, atualizar e deletar usuários
router.post('/', usuariosController.createUsuario)
// router.put('/:id', usuariosController.updateUsuario)
// router.delete('/:id', usuariosController.deleteUsuario)

export default router
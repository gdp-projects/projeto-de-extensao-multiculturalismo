const express = require('express')
const router = express.Router()

const usuariosController = require('../controllers/usuariosController')

// Rota de ver usuários
router.get('/', usuariosController.getUsuarios)
router.get('/:id', usuariosController.getUsuarioById)

// Rotas de criar, atualizar e deletar usuários
router.post('/', usuariosController.createUsuario)
router.put('/:id', usuariosController.updateUsuario)
router.delete('/:id', usuariosController.deleteUsuario)

module.exports = router

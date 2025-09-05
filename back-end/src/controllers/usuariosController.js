import usuarioModel from '../models/usuariosModel.js';

// Função para obter todos os usuários
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getAllUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter usuários' });
    }
};

const getUsuarioById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const usuario = await usuarioModel.getUsuarioById(id);
        if (usuario) {
            res.status(200).json(usuario);
        }
        else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter usuário' });
    }
};

const createUsuario = async (req, res) => {
    const usuario = req.body;
    try {
        const novoUsuario = await usuarioModel.createUsuario(usuario);
        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

export default {
    getUsuarios,
    getUsuarioById,
    createUsuario
};
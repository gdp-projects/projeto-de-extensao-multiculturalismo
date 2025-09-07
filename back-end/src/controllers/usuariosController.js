import usuarioModel from '../models/usuariosModel.js';
import usuariosUpdate from '../models/usuariosUpdate.js';

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
    const { nome, sobrenome, email, nome_usuario, telefone, dataNascimento, senha } = req.body;
    const usuario = { nome, sobrenome, email, nome_usuario, telefone, dataNascimento, senha };
    try {
        const novoUsuario = await usuarioModel.createUsuario(usuario);
        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
        console.error(error);
    }
}

const updateUsuario = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const usuario = req.body;
    try {
        const usuarioAtualizado = await usuariosUpdate.updateUsuario(id, usuario);
        if (usuarioAtualizado) {
            res.status(200).json(usuarioAtualizado);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
}

export default {
    getUsuarios,
    getUsuarioById,
    createUsuario
};
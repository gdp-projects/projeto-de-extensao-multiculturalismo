import usuariosModel from '../models/usuariosModel.js';
import usuarioModel from '../models/usuariosModel.js';
import usuariosUpdate from '../models/usuariosUpdate.js';

import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

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
    const salts = 10; // Força do hash
    try {
        const senhaCrypt = await bcrypt.hash(senha, salts); // Cria a criptografia
        const usuario = { nome, sobrenome, email, nome_usuario, telefone, dataNascimento, senhaCrypt };
        const novoUsuario = await usuarioModel.createUsuario(usuario);
        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
        console.error(error);
    }
}

const loginUsuario = async (req, res) => {
    const { nome_usuario, senha } = req.body; // Login digitado pelo usuário
    try {
        const usuarioCadastrado = await usuarioModel.getUsuarioByNomeUsuario(nome_usuario); // Pega as informações do usuário
        if(!usuarioCadastrado) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        };
        const senhaCorreta = await bcrypt.compare(senha, usuarioCadastrado.senha); // Compara a senha digitada com o Hash salvo no banco de dados
        if(!senhaCorreta) {
            return res.status(401).json({ error: "Senha inválida" });
        };
        // const resultadoLoginUsuario = await usuarioModel.loginUsuario(nome_usuario, usuarioCadastrado.senha); // Realiza login do usuário
        const token = jwt.sign({ user: nome_usuario }, secret, { expiresIn: "1h" })
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ error: "Erro ao tentar realizar login" });
        console.log(error);
    };
}

const deleteUsuario = async (req, res) => {
    const id = req.params.id;
    const { nome_usuario, senha } = req.body;
    if(!id || !nome_usuario || !senha) { // Valida se foram enviado todos os parametros para validar
        return res.status(400).json({ error: "É necessário preencher todos os campos" });
    };
    const idNum = parseInt(id, 10); // converte id para numero
    try {
        const usuarioCadastrado = await usuariosModel.getUsuarioById(idNum);
        if(!usuarioCadastrado) { //Verifica se o usuário existe ou não
            return res.status(404).json({ error: "Usuário não encontrado" });
        };
        if(usuarioCadastrado.nome_usuario !== nome_usuario) { // Verifica se o usuário é válido
            return res.status(401).json({ error: "nome_usuário inválido!" });
        };
        const senhaCorreta = await bcrypt.compare(senha, usuarioCadastrado.senha); // compara o hash com a senha enviada pelo usuário
        if (!senhaCorreta) { // Valida se senha é válida
        return res.status(401).json({ error: "Senha inválida!" });
    };
        const deletarUsuario = await usuarioModel.deleteUsuario(idNum, nome_usuario, usuarioCadastrado.senha); // Deleta usuário no banco de dados
        res.status(200).json(deletarUsuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao tentar deletar usuário" });
        console.log(error);
    };
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
    createUsuario,
    loginUsuario,
    deleteUsuario
};
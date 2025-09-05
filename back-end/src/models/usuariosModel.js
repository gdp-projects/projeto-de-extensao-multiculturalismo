import pool from "../config/db/postgreSQL.js";

const getAllUsuarios = async () => {
    const res = await pool.query('SELECT * FROM usuarios');
    return res.rows;
}

const getUsuarioById = async (id) => {
    const res = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
    return res.rows[0];
}

const getUsuarioByNomeUsuario = async (nome_usuario) => {
    const res = await pool.query('SELECT * FROM usuarios WHERE nome_usuario = $1', [nome_usuario]);
    return res.rows[0];
}

const createUsuario = async (usuario) => {
    const { nome, sobrenome, email, nome_usuario, senha, data_nascimento, telefone, foto, id_endereco } = usuario;
    const res = await pool.query(
        'INSERT INTO usuarios (nome, sobrenome, email, nome_usuario, senha, data_nascimento, telefone, foto, id_endereco, isVerify, isPro, isOrganizer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [nome, sobrenome, email, nome_usuario, senha, data_nascimento, telefone, foto, id_endereco, false, false, false]
    );
    return res.rows[0];
}

const loginUsuario = async (nome_usuario, senha) => {
    const res = await pool.query('SELECT * FROM usuarios WHERE nome_usuario = $1 AND senha = $2', [nome_usuario, senha]);
    return res.rows[0];
}

export default {
    getAllUsuarios,
    getUsuarioById,
    getUsuarioByNomeUsuario,
    createUsuario,
    loginUsuario,
    upgradeUsuarioToPro,
    transformarUsuarioEmOrganizador,
    verificarUsuario,
    deixarDeSerOrganizador,
    finalizarContaPro
};
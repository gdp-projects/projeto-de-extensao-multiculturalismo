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
    const { nome, sobrenome, email, nome_usuario, senha, data_nascimento, telefone, foto} = usuario;
    const res = await pool.query(
        'INSERT INTO usuarios (primeiro_nome, sobrenome, email, nome_usuario, senha, data_nascimento, telefone, foto, isVerify, isPro, isOrganizer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [nome, sobrenome, email, nome_usuario, senha, data_nascimento, telefone, foto, false, false, false]
    );
    return res.rows[0];
}

const findUsuarioByNome = async (nome_usuario) => {
    const res = await pool.query(
        'SELECT * FROM usuarios WHERE nome_usuario = $1',
        [nome_usuario]
    );
    return res.rows[0];
};

const deleteUsuario = async (id, nome_usuario, senha) => {
    // corrigido para usar a coluna id_usuario
    const res = await pool.query('DELETE FROM usuarios WHERE nome_usuario = $1 AND senha = $2 AND id_usuario = $3', [nome_usuario, senha, id])
    return res.rowCount
}

const promoverParaOrganizador = async (id_usuario) => {
    const res = await pool.query(
        'UPDATE usuarios SET isorganizer = TRUE WHERE id_usuario = $1 RETURNING *',
        [id_usuario]
    );
    return res.rows[0];
};

const alterarFotoPerfil = async (id_usuario, novaFoto) => {
    const res = await pool.query(
        'UPDATE usuarios SET foto = $1 WHERE id_usuario = $2 RETURNING *',
        [novaFoto, id_usuario]
    );
    return res.rows[0];
}

export default {
    getAllUsuarios,
    getUsuarioById,
    getUsuarioByNomeUsuario,
    createUsuario,
    findUsuarioByNome,
    deleteUsuario,
    promoverParaOrganizador,
    alterarFotoPerfil
};
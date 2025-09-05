import pool from '../config/db/postgreSQL.js';

const updateUsuario = async (id, usuario) => {
    const { nome, sobrenome, data_nascimento } = usuario;
    const res = await pool.query(
        'UPDATE usuarios SET nome = $1, sobrenome = $2, data_nascimento = $3 WHERE id_usuario = $4 RETURNING *',
        [nome, sobrenome, data_nascimento, id]
    );
    return res.rows[0];
}

const updateNomeUsuario = async (id, nome_usuario) => {
    const res = await pool.query(
        'UPDATE usuarios SET nome_usuario = $1 WHERE id_usuario = $2 RETURNING *',
        [nome_usuario, id]
    );
    return res.rows[0];
}

const updateEmail = async (id, email) => {
    const res = await pool.query(
        'UPDATE usuarios SET email = $1 WHERE id_usuario = $2 RETURNING *',
        [email, id]
    );
    return res.rows[0];
}

const updateTelefone = async (id, telefone) => {
    const res = await pool.query(
        'UPDATE usuarios SET telefone = $1 WHERE id_usuario = $2 RETURNING *',      
        [telefone, id]
    );
    return res.rows[0];
}

const updateFoto = async (id, foto) => {
    const res = await pool.query(
        'UPDATE usuarios SET foto = $1 WHERE id_usuario = $2 RETURNING *',  
        [foto, id]
    );
    return res.rows[0];
}

const updateSenha = async (id, senha) => {
    const res = await pool.query(
        'UPDATE usuarios SET senha = $1 WHERE id_usuario = $2 RETURNING *',  
        [senha, id]
    );
    return res.rows[0];
}

const upgradeUsuarioToPro = async (id) => {
    const res = await pool.query(
        'UPDATE usuarios SET isPro = true WHERE id_usuario = $1 RETURNING *',
        [id]
    );
    return res.rows[0];
}

const transformarUsuarioEmOrganizador = async (id) => {
    const res = await pool.query(
        'UPDATE usuarios SET isOrganizer = true WHERE id_usuario = $1 RETURNING *',
        [id]
    );
    return res.rows[0];
}

const verificarUsuario = async (id) => {
    const res = await pool.query(
        'UPDATE usuarios SET isVerify = true WHERE id_usuario = $1 RETURNING *',
        [id]
    );
    return res.rows[0];
}

const deixarDeSerOrganizador = async (id) => {
    const res = await pool.query(
        'UPDATE usuarios SET isOrganizer = false WHERE id_usuario = $1 RETURNING *',
        [id]
    );
    return res.rows[0];
}

const finalizarContaPro = async (id) => {
    const res = await pool.query(
        'UPDATE usuarios SET isPro = false WHERE id_usuario = $1 RETURNING *',
        [id]
    );
    return res.rows[0];
}

export default {
    updateUsuario,
    updateTelefone,
    updateFoto,
    updateSenha,
    upgradeUsuarioToPro,
    transformarUsuarioEmOrganizador,
    verificarUsuario,
    deixarDeSerOrganizador,
    finalizarContaPro
}
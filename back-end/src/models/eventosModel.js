import pool from "../config/db/postgreSQL.js";

const createEvento = async (evento) => {
    const {
        nome_evento,
        foto_local = null,
        descricao = null,
        data_inicio = null,
        hora_inicio = null,
        data_fim = null,
        hora_fim = null,
        endereco = null,
        categoria = [],
        status = 'ativo',
        id_usuario = null
    } = evento;

    const res = await pool.query(
        `INSERT INTO eventos (nome_evento, foto_local, descricao, data_inicio, hora_inicio, data_fim, hora_fim, endereco, categoria, status, id_usuario)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [nome_evento, foto_local, descricao, data_inicio, hora_inicio, data_fim, hora_fim, endereco, categoria, status, id_usuario]
    );

    return res.rows[0];
};


const createIngresso = async (ingresso) => {
    const { nome, tipo, preco = 0.0, quantidade = 0, fk_evento = null } = ingresso;
    const res = await pool.query(
        `INSERT INTO ingressos (nome, tipo, preco, quantidade, fk_evento)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [nome, tipo, preco, quantidade, fk_evento]
    );
    return res.rows[0];
};

const addOrganizadorToEvento = async (id_evento, id_usuario) => {
    const res = await pool.query(
        'INSERT INTO organizador_evento (id_evento, id_usuario) VALUES ($1, $2) RETURNING *',
        [id_evento, id_usuario]
    );
    return res.rows[0];
};

const addIngressoToEvento = async (id_evento, id_ingresso) => {
    const res = await pool.query(
        'UPDATE eventos SET fk_ingresso = array_append(coalesce(fk_ingresso, ARRAY[]::integer[]), $1) WHERE id = $2 RETURNING *',
        [id_ingresso, id_evento]
    );
    return res.rows[0];
};

const getAllEventos = async () => {
    const res = await pool.query('SELECT * FROM eventos ORDER BY data_inicio DESC, id DESC');
    return res.rows;
};

const getEventoByUserId = async (id_usuario) => {
    const res = await pool.query('SELECT * FROM eventos WHERE id_usuario = $1 ORDER BY data_inicio DESC, id DESC', [id_usuario]);
    return res.rows;
};

const getEventoById = async (id) => {
    const res = await pool.query('SELECT * FROM eventos WHERE id = $1', [id]);
    return res.rows[0];
};

const getEventoByName = async (nome_evento) => {
    const res = await pool.query(
        "SELECT * FROM eventos WHERE nome_evento ILIKE $1 ORDER BY data_inicio DESC",
        [`%${nome_evento}%`]
    );
    return res.rows;
};

const deleteEvento = async (id) => {
    await pool.query('DELETE FROM eventos WHERE id = $1', [id]);
};

const updateEvento = async (id, evento) => {
    const { foto_local, data_inicio, data_fim, hora_inicio, hora_fim, nome_evento, descricao, link, categoria, status, endereco } = evento;

    const res = await pool.query(
        `INSERT INTO eventos (foto_local, data_inicio, data_fim, hora_inicio, hora_fim, nome_evento, descricao, link, categoria, status, fk_endereco)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [foto_local, data_inicio, data_fim, hora_inicio, hora_fim, nome_evento, descricao, link, categoria, status, fk_endereco]
    );

    return res.rows[0];
};

export default {
    createEvento,
    createIngresso,
    addOrganizadorToEvento,
    addIngressoToEvento,
    getAllEventos,
    getEventoById,
    getEventoByName,
    getEventoByUserId,
    deleteEvento,
    updateEvento
};

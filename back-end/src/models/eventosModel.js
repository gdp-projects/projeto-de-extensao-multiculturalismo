import pool from "../config/db/postgreSQL.js";

const createEvento = async (evento) => {
    const { foto_local, data, hora, nome_evento, is_online, link, categoria, status} = evento;
    const res = await pool.query(
        'INSERT INTO eventos (foto_local, data, hora, nome_evento, is_online, link, categoria, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [foto_local, data, hora, nome_evento, is_online, link, categoria, status]
    );
    return res.rows[0];
}

const getAllEventos = async () => {
    const res = await pool.query('SELECT * FROM eventos');
    return res.rows;
}

const getEventoById = async (id) => {
    const res = await pool.query('SELECT * FROM eventos WHERE id = $1', [id]);
    return res.rows[0];
}

const getEventoByName = async (nome_evento) => {
    const res = await pool.query("SELECT * FROM eventos Where nome_evento ILIKE $1 ORDER BY data DESC", [`%${nome_evento}%`])
    return res.rows
}

export default {createEvento,
    getAllEventos,
    getEventoById,
    getEventoByName
};
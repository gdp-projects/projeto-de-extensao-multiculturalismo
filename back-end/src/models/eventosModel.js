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

const getEventoByUserId = async (id_usuario) => {
    const res = await pool.query(
        `SELECT evento.* FROM evento
        INNER JOIN organizador_evento ON evento.id_evento = organizador_evento.id_evento
        WHERE organizador_evento.id_usuario = $1`,
        [id_usuario]
    )
    return res.rows
}

const getEventoById = async (id) => {
    const res = await pool.query('SELECT * FROM eventos WHERE id = $1', [id]);
    return res.rows[0];
}

const getEventoByName = async (nome_evento) => {
    const res = await pool.query("SELECT * FROM eventos Where nome_evento ILIKE $1 ORDER BY data DESC", [`%${nome_evento}%`])
    return res.rows
}
const deleteEvento = async (id) => {
    await pool.query('DELETE FROM eventos WHERE id = $1', [id]);
};

const updateEvento = async (id, evento) => {
    const { foto_local, data, hora, nome_evento, is_online, link, categoria, status } = evento;
    const res = await pool.query(
        `UPDATE eventos SET
         foto_local = $1,
         data = $2,
         hora = $3,
         nome_evento = $4,
         is_online = $5,
         link = $6,
         categoria = $7,
         status = $8
         WHERE id = $9
         RETURNING *`,
        [foto_local, data, hora, nome_evento, is_online, link, categoria, status, id]
    );
    return res.rows[0];
};

export default {createEvento,
    getAllEventos,
    getEventoById,
    getEventoByName,
    getEventoByUserId
    deleteEvento,
    updateEvento
};
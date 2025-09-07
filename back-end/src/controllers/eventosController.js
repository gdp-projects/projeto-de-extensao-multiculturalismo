import eventosModel from '../models/eventosModel.js';

const getEventos = async (req, res) => {
    try {
        const eventos = await eventosModel.getAllEventos();
        res.status(200).json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter eventos' });
    }
};

const getEventoById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const evento = await eventosModel.getEventoById(id);
        if (evento) {
            res.status(200).json(evento);
        }
        else {
            res.status(404).json({ error: 'Evento não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter Evento' });
    }
};

const createEvento = async (req, res) => {
    const {foto_local, data, hora, nome_evento, is_online, link, categoria, status} = req.body;
    const evento = {foto_local, data, hora, nome_evento, is_online, link, categoria, status};
    try {
        const novoEvento = await eventosModel.createEvento(evento);
        res.status(201).json(novoEvento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar evento' });
        console.error(error);
    }
}


export default {
    createEvento, 
    getEventos, 
    getEventoById};
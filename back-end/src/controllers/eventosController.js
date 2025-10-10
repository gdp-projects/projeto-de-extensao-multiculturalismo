import eventosModel from '../models/eventosModel.js';

const getEventos = async (req, res) => {
    try {
        const eventos = await eventosModel.getAllEventos();
        res.status(200).json(eventos);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao obter eventos' });
    }
};

const getEventoByUserId = async (req, res) => {
    const id_usuario = parseInt(req.params.id_usuario)

    try {
        const eventosDoUsuario = await eventosModel.getEventoByUserId(id_usuario)
        if (evento.length() === 0) {
            return res.status(404).json({ error: "Nenhum evento encontrado para esse usuário" })
        }
        res.status(200).json(eventosDoUsuario)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro ao obter eventos do usuário "})
    }
}

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

const getEventoByName = async (req, res) => {
    const nome_evento = req.query.nome_evento
    try {
        const eventos = await eventosModel.getEventoByName(nome_evento)
        if(eventos.length === 0) {
            return res.status(404).json({ error: "Evento não encontrado" })
        }
        res.status(200).json(eventos)
    } catch (error) {
        res.status(500).json({ error: "Erro ao tentar pesquisar eventos" })
        console.error(error)
    }
}

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

const deleteEvento = async (req, res) => {
    const { id } = req.params;
    try {
        await eventosModel.deleteEvento(id);
        res.status(204).end(); // 204 No Content para indicar sucesso sem corpo de resposta
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar evento' });
    }
};

const updateEvento = async (req, res) => {
    const { id } = req.params;
    const evento = req.body;

    try {
        const eventoAtualizado = await eventosModel.updateEvento(id, evento);

        if (eventoAtualizado) {
            res.status(200).json(eventoAtualizado);
        } else {
            res.status(404).json({ error: 'Evento não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar evento' });
    }
};


export default {
    createEvento, 
    getEventos, 
    getEventoById,
    getEventoByName,
    getEventoByUserId
    deleteEvento,
    updateEvento
};
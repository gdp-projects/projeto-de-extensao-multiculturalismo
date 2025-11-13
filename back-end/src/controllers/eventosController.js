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
    const {nome_evento, foto_local, descricao, data, hora, endereco, categoria, status, id_usuario} = req.body;
    const evento = {nome_evento, foto_local, descricao, data, hora, endereco, categoria, status, id_usuario};
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

const addOrganizadorToEvento = async (req, res) => {
    const { id_evento, id_usuario } = req.body;
    try {
        await eventosModel.addOrganizadorToEvento(id_evento, id_usuario);
        res.status(201).json({ message: 'Organizador adicionado ao evento com sucesso' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar organizador ao evento' });
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
    getEventoByUserId,
    deleteEvento,
    updateEvento,
    addOrganizadorToEvento
};
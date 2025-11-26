import jwt from "jsonwebtoken"

function autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        console.warn('autenticarToken - nenhum token fornecido')
        return res.status(401).json({ error: "Token não fornecido" })
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, usuario ) => {
        if(error) {
            console.error('autenticarToken - erro ao verificar token:', error && error.message)
            return res.status(403).json({ error: "Token inválido" })
        }

        req.usuario = usuario
        next();
    })
}

function autenticarOrganizador(req, res, next) {
    if(!req.usuario.isOrganizer) {
        return res.status(403).json({ error: "Acesso apenas para organizadores." })
    }
    next()
}

export default {
    autenticarToken,
    autenticarOrganizador
}
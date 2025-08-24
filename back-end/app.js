const express = require('express')
const app = express()
const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`)
  console.log(`https://localhost:${PORT}`)
})
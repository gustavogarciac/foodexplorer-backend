const express = require("express")
const server = express()

const router = require("./routes")

server.use(express.json())
server.use(router)


const port = 3333;
server.listen(port, () => console.log(`🚀 Servidor inicializado em http://localhost:3333`))
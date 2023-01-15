import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const mongoClient = new MongoClient(process.send.DATABASE_URL)
let db


const server = express()
server.use(express.json())
server.use(cors())

server.post("/participants", async (req, res) => {
    let usuario = req.data
    const usuarioSchema = joi.object({
        name: joi.string().required()
    })
    const validation = usuarioSchema.validade(usuario)

    try{
        const userJaCadastrado = await db.collect("participants").findOne({usuario})
        
        if(userJaCadastrado) return res.status(409).send("Já existe um usuário com esse nome")

        const cadastrar = await db.collect("participants").insertOne({name: usuario, lastStatus: Date.now()})

        const conectou = await db.collect("messages").insertOne({name: usuario, to:"Todos", text:"entra na sala...", type:"status",  time: "HH:MM:SS"})

        res.send("usuário cadastrado")

    }catch(err){
        res.status(422)
    }
})

server.get("/participants", (req, res) => {
    
})

server.post("/mensages", (req, res) => {
    
})

server.post("/mensages", (req, res) => {
    
})

server.post("/status", (req, res) => {
    
})


server.listen(5000, () => {
    console.log('Funcionando')
  })
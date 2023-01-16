import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import dayjs from "dayjs"
import joi from "joi"

dotenv.config()

const mongoClient = new MongoClient("mongodb://localhost:27017")
let db
await mongoClient.connect()
db = mongoClient.db()


const server = express()
server.use(express.json())
server.use(cors())

server.post("/participants", async (req, res) => {
    let usuario = req.body.name
    const usuarioSchema = joi.object({
        name: joi.string().required()
    })

    const validation = usuarioSchema.validate(usuario)

    try{
        const userJaCadastrado = await db.collection("participants").findOne({name: usuario})
        
        if(userJaCadastrado) return res.status(409).send("Já existe um usuário com esse nome")
        const cadastrar = await db.collection("participants").insertOne({name: usuario, lastStatus: Date.now()})
        
        const conectou = await db.collection("messages").insertOne({name: usuario, to:"Todos", text:"entra na sala...", type:"status",  time: dayjs().format("HH:mm:ss")})
        
        res.send("usuário cadastrado")
        
    }catch(err){
        res.status(422)
    }
})

server.get("/participants", async (req, res) => {
    try{
        const listaParticipantes = await db.collect("participantes").find()
        res.send(listaParticipantes)

    }catch(err){
        console.log(err)
        res.send(err)
    }

})

server.post("/messages", async (req, res) => {
    const {to, text, type} = req.body
    const {user} = req.headers
    let mensagem = req.body
    console.log(mensagem)

    const messageSchema = joi.object({
        to: joi.string().required(),
        text: joi.string().required(),
        type: joi.string().valid("message", "private_message").required()
     })

    const validate = messageSchema.validate(mensagem)
    console.log(user)
    
    try{
        const userOnline = await db.collection("participants").find().toArray()
        
        if(!userOnline) return res.send("Você foi desconectado")
        
        const mensagemEnviada = await db.collection("messages").insertOne({from: user,to: to,text: text ,type: type ,time: dayjs().format("HH:mm:ss")})
        
        return res.status(201).send()
    }catch(err){
        res.status(422)
        console.log(err)
    }
     


})

server.get("/messages", async (req, res) => {
    const {user} = req.headers
    const limitMessage = req.query.limit

    console.log(limitMessage, user)
    try{
        if(limitMessage){
            const mensagens = await db.collection("messages").find( {$or: [{from:user}, {to:"todos"}, {to:user}]} ).toArray()
            let mensagensLimit = mensagens.slice(-limitMessage)
            res.send(mensagensLimit)
        
    }

    }catch(err){
        res.send("Não foi possível buscar as mensagens")
        console.log(err)
}
    
})

server.post("/status", (req, res) => {
    
})


server.listen(5000, () => {
    console.log('Funcionando')
  })
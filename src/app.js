import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import dayjs from "dayjs"
import joi from "joi"

dotenv.config()

const mongoClient = new MongoClient("mongodb://localhost:27017")
let db


const server = express()
server.use(express.json())
server.use(cors())

server.post("/participants", async (req, res) => {
    let usuario = req.data
    const usuarioSchema = joi.object({
        name: joi.string().required()
    })
    const validation = usuarioSchema.validate(usuario)

    console.log(validation)

    try{
        const userJaCadastrado = await db.collection("participants").findOne({usuario})
        
        if(userJaCadastrado) return res.status(409).send("Já existe um usuário com esse nome")
        const cadastrar = await db.collection("participants").insertOne({name: usuario, lastStatus: Date.now()})
        
        const conectou = await db.collection("messages").insertOne({name: usuario, to:"Todos", text:"entra na sala...", type:"status",  time: dayjs("HH:mm:ss")})
        
        res.send("usuário cadastrado")
        
    }catch(err){
        res.status(422)
    }
})

server.get("/participants", async (req, res) => {
    try{
        const listaParticipantes = await db.collect("participantes").find()
        return listaParticipantes

    }catch(err){
        console.log(err)
        res.send(err)
    }

})

server.post("/mensages", async (req, res) => {
    let mensagens = req.data
    let userheader = req.header.user
    console.log(userheader)

    const mensageSchema = joi.object({
        to: joi.string().required(),
        text: joi.string().required(),
        type: joi.string().valid("message", "private_message").required()
     })

    const validate = mensageSchema.validate(mensagens)

    try{
        const userOnline = await db.collection("participantes").findOne({userheader})
        if(!userOnline) return res.send("Você foi desconectado")
        const mensagemEnviada = await db.collection("mensages").insertOne({from: userheader,to: mensagens.to ,text: mensagens.text ,type: mensagens.type ,time: dayjs("HH:mm:ss")})

    }catch(err){
        res.status(422)
        console.log(err)
    }
     


})

server.get("/mensages", (req, res) => {
    let userheader = req.header.user
    let limitMensage = req.query
})

server.post("/status", (req, res) => {
    
})


server.listen(5000, () => {
    console.log('Funcionando')
  })
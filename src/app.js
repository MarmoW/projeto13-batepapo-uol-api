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



server.listen(5000, () => {
    console.log('Funcionando')
  })
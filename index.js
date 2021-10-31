const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId 
require('dotenv').config()

const app = express()
const port = process.env.PORT ||5000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tecyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        console.log('connected to database')
        const database = client.db('touristHeaven')
        const serviceCollection = database.collection('services')

        // GET API
        app.get('/services', async(req,res)=>{
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        
        // Get Single Service 
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id
            console.log("getting id", id)
            const query = { _id : ObjectId(id)} // Do not use "=" instead of ":"
            const service = await serviceCollection.findOne()
            res.json(service)
        })

    }finally{
        // await client.close()
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/deki', (req,res)=>{
    res.send('Workin')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
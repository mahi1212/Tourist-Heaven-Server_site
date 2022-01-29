const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId 
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
        const orderCollection = database.collection('orders')

        // GET service API
        app.get('/services', async(req,res)=>{
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.json(services)
        })
        
        // Post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.json(result)
        })

        // Get Order API -- use email here 
        app.get('/orders', async(req,res)=>{
            const email = req.query.email
            const query = {email : email}//here first email is field of database orders collection
            console.log(query)
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.json(orders)
        })

        // Post Order API
        app.post('/orders', async(req,res)=>{
            const order = req.body
            const myOrder = await orderCollection.insertOne(order)
            res.json(myOrder)
        })

        // // Get Single Service 
        // app.get('/services/:serviceName', async(req,res)=>{
        //     const id = req.params.serviceName
        //     const query = { _id : ObjectId(id)}
        //     const service = await orderCollection.findOne(query)
        //     res.json(service)
        // })
        

    }finally{
        // await client.close()
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000


//middleware

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qwhtqkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const run = async() =>{
    try{
        const userCollection = client.db('Asian_Restaurant').collection('users')
        const foodsCollection = client.db('Asian_Restaurant').collection('foods')

        app.post('/users', async(req,res) =>{
            const newUser = req.body
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })

        app.get('/users', async(req, res) =>{
            const users = req.body
            const  result = await userCollection.find(users).toArray()
            res.send(result)
        })

        app.post('/foods', async(req, res) =>{
            const foods = req.body
            const result = await foodsCollection.insertOne(foods)
            res.send(result)
        })

        app.get('/foods', async(req, res) =>{
            const foods = req.body
            const result = await foodsCollection.find(foods).toArray()
            res.send(result)
        })
        app.get('/foods/:id', async(req, res) =>{
            const id = req.params.id
            const query = { _id: new ObjectId(id)}
            const result = await foodsCollection.findOne(query)
            res.send(result)
        })

    }
    finally{

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Welcome to the Asians sever')
})

app.listen(port, () =>{
    console.log('connected');
})
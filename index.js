const express = require('express');
const app = express()
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000


//middleware

app.use(cors({
    origin: ['http://localhost:5173', 'https://asian-web-app.web.app'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const admin = require("firebase-admin");
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qwhtqkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers?.authorization
    // console.log('inside the function' ,authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'unauthorized access' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = await admin.auth().verifyIdToken(token)
        console.log('decoded token', decoded);

        next()
    }
    catch (error) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
}

const emailVerify = (req, res, next) =>{
    if(req.params.email !== req.decoded.email){
        return res.status(403).send({message: 'Forbidden Access'})
    }
    next()
}

const run = async () => {
    try {
        // await client.connect();

        const userCollection = client.db('Asian_Restaurant').collection('users')
        const foodsCollection = client.db('Asian_Restaurant').collection('foods')
        const orderCollection = client.db('Asian_Restaurant').collection('orders')

        //jwt token
        // app.post('/jwt', (req, res) => {
        //     const userData = req.body
        //     const token = jwt.sign(userData, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1d' })

        //     res.cookie('token', token, {
        //         httpOnly: true,
        //         secure: false
        //     })

        //     res.send({ success: true })
        // })


        //user apis
        app.post('/users', async (req, res) => {
            const newUser = req.body
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })


        app.get('/users', async (req, res) => {
            const result = await userCollection.find(users).toArray()
            res.send(result)
        })

        //food api
        app.post('/foods', async (req, res) => {
            const foods = req.body
            const result = await foodsCollection.insertOne(foods)
            res.send(result)
        })

        app.get('/foods', async (req, res) => {
            const result = await foodsCollection.find().toArray()
            res.send(result)
        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await foodsCollection.findOne(query)
            res.send(result)
        })

        app.get('/food/:email', verifyFirebaseToken, emailVerify, async (req, res) => {
            const email = req.params.email
            const query = { addedBy: email }
            const result = await foodsCollection.find(query).toArray()
            res.send(result)
        })

        app.patch('/foods/:id', async (req, res) => {
            const foodId = req.params.id
            const { orderedQuantity } = req.body
            const result = await foodsCollection.updateOne(
                { _id: new ObjectId(foodId) },
                {
                    $inc: {
                        purchaseCount: parseInt(orderedQuantity),
                        quantity: -parseInt(orderedQuantity)
                    }
                }
            );
            res.send(result)
        })

        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedFood = req.body
            const updatedDoc = {
                $set: updatedFood
            }
            const result = await foodsCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })


        //top purchase
        app.get('/top-purchase', async (req, res) => {
            const result = await foodsCollection
                .find()
                .sort({ purchaseCount: -1 })
                .limit(8)
                .toArray()
            res.send(result)
        })

        //order api
        app.post('/orders', async (req, res) => {
            const orders = req.body
            const result = await orderCollection.insertOne(orders)
            res.send(result)
        })

        app.get('/orders', async (req, res) => {
            const result = await orderCollection.find().toArray()
            res.send(result)
        })

        app.get('/order/:email', verifyFirebaseToken, emailVerify, async (req, res) => {
            const email = req.params.email
            // console.log('req header', req.headers);
            const query = { userEmail: email }
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Welcome to the Asians sever')
})

app.listen(port, () => {
    console.log('connected');
})
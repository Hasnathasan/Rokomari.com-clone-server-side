const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Rokomari is Running');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmw0s1b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connectToMongoDB() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        // Collections
        const db = client.db('rokomari_server');
        const hotDealsCollection = db.collection('hot-deals');
        const booksCollection = db.collection('books');
        const usersCollection = db.collection('users');

        // Users Endpoints
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });

        app.get('/eachUser/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.send(result || { "notFound": true });
        });

        app.get('/each-user-by-number/:number', async (req, res) => {
            const number = req.params.number;
            const query = { phoneNumber: number };
            const result = await usersCollection.findOne(query);
            res.send(result || { "notFound": true });
        });

        app.post('/users', async (req, res) => {
            const data = req.body;
            const result = await usersCollection.insertOne(data);
            res.send(result);
        });

        app.patch('/updateUser/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: data.name,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    date_of_birth: data.date_of_birth,
                    gender: data.gender,
                    photoUrl: data.photoUrl,
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Hot Deals Endpoints
        app.get('/hot-deals', async (req, res) => {
            const result = await hotDealsCollection.find().toArray();
            res.send(result);
        });

        app.get('/hot-deals/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await hotDealsCollection.findOne(query);
            res.send(result);
        });

        // Books Endpoints
        app.get('/books', async (req, res) => {
            const result = await booksCollection.find().toArray();
            res.send(result);
        });

        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await booksCollection.findOne(query);
            res.send(result);
        });

        app.get('/booksByCategory/:category', async (req, res) => {
            const category = req.params.category;
            const query = { main_category: category };
            const result = await booksCollection.find(query).toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function run() {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`Rokomari is Running on port ${port}`);
    });
}

run().catch(console.dir);



app.listen(port, () => {
    console.log(`Rokomari is Running on port ${port}`)
})



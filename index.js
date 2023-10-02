const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Rokomari is Running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmw0s1b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //Collections
        const hotDealsCollection = client.db('rokomari_server').collection('hot-deals');
        const booksCollection = client.db('rokomari_server').collection('books');
        const usersCollection = client.db('rokomari_server').collection('users');

        app.get('/users', async(req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        }) 

        app.get('/eachUser/:email', async(req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email : email };
            const result = await usersCollection.findOne(query);
            if(result === null){
                res.send({"notFound": true});
            }
            else{

                res.send(result)
            }
        })

        app.get('/each-user-by-number/:number', async(req, res) => {
            const number = req.params.number;
            const query = { phoneNumber: number };
            const result = await usersCollection.findOne(query);
            if(result === null){
                res.send({"notFound": true});
            }
            else{

                res.send(result)
            }
        })

        app.post('/users', async(req, res) => {
            const data = req.body;
            const result = await usersCollection.insertOne(data);
            res.send(result)
        })
        
        app.get('/hot-deals', async(req,res)=>{
            const result = await hotDealsCollection.find().toArray()
            res.send(result)
        })
        app.get("/hot-deals/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await hotDealsCollection.findOne(query);
            res.send(result);
          });

        app.get("/books", async(req, res) => {
            const result = await booksCollection.find().toArray();
            res.send(result)
        })
        app.get("/books/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await booksCollection.findOne(query);
            res.send(result);
          });

        app.get("/booksByCategory/:category", async (req, res) => {
            const category = req.params.category;
            const query = { "main_category": category };
            const result = await booksCollection.find(query).toArray();
            res.send(result);
          });


        



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Rokomari is Running on port ${port || 5000}`)
})



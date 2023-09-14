const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();

        //Collections
        const hotDealsCollection = client.db('rokomari_server').collection('hot-deals')
        const fictionBooksCollection = client.db('rokomari_server').collection('fictionBooks')
        const nonFictionBooksCollection = client.db('rokomari_server').collection('nonFictionBooks')
        const islamiBooksCollection = client.db('rokomari_server').collection('islamiBooks')
        const westBangleBooksCollection = client.db('rokomari_server').collection('westBengleBooks')
        const academicBooksBooksCollection = client.db('rokomari_server').collection('academicBooks')
        
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

        app.get('/fiction-books', async(req,res)=>{
            const result = await fictionBooksCollection.find().toArray()
            res.send(result)
        })
        app.get("/fiction-books/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await fictionBooksCollection.findOne(query);
            res.send(result);
          });

        app.get('/non-fiction-books', async(req,res)=>{
            const result = await nonFictionBooksCollection.find().toArray()
            res.send(result)
        })
        app.get("/non-fiction-books/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await nonFictionBooksCollection.findOne(query);
            res.send(result);
          });
        app.get('/islami-books', async(req,res)=>{
            const result = await islamiBooksCollection.find().toArray()
            res.send(result)
        })
        app.get("/islami-books/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await islamiBooksCollection.findOne(query);
            res.send(result);
          });
        app.get('/west-bangle-books', async(req,res)=>{
            const result = await westBangleBooksCollection.find().toArray()
            res.send(result)
        })
        app.get("/west-bangle-books/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await westBangleBooksCollection.findOne(query);
            res.send(result);
          });
        app.get('/academic-books', async(req,res)=>{
            const result = await academicBooksBooksCollection.find().toArray()
            res.send(result)
        })
        app.get("/academic-books/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await academicBooksBooksCollection.findOne(query);
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



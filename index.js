const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');




// middle war
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icikx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('volunteers');
        const volunteersCollection = database.collection('events');
        const userEventCollection = database.collection('userEvent');

        // Query for a movie that has the title 'Back to the Future'  
        app.get('/events', async (req, res) => {
            const cursor = await volunteersCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        app.get('/events/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { "_id": ObjectId(id) }
            const result = await volunteersCollection.findOne(query);
            console.log(result);
            res.send(result)
        })
        app.delete('/events/:_id', async (req, res) => {
            const id = req.params._id;
            console.log(id);
            const query = { "_id": ObjectId(id) }
            const result = await userEventCollection.deleteOne(query);
            console.log(result);
            res.send(result)
        })

        app.post('/register', async (req, res) => {
            const doc = req.body;
            console.log('boyd', req.body);
            const result = await userEventCollection.insertOne(doc);
            console.log('before', result);
        })

        app.get('/userEvents', async (req, res) => {
            const cursor = await userEventCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        app.post('/userEvent', async (req, res) => {
            const email = req.body.email;
            console.log('watch email', email);
            const query = { email: { $in: Object.values(req.body) } }
            const cursor = await userEventCollection.find(query).toArray();
            console.log(cursor);
            res.send(cursor);
        })
        app.delete('/user/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: { $regex: email } };
            const result = await volunteersCollection.deleteMany(query);

        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('volunteer jon server is running');
});

app.listen(port, () => {
    console.log('server is running at port', port);
})
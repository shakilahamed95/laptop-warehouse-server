const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7cgfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function laptop() {
    try {
        await client.connect();
        const laptopCollection = client.db("laptop-house").collection("inventory");
        app.get('/laptops', async (req, res) => {
            const query = {};
            const cursor = laptopCollection.find(query)
            const laptops = await cursor.toArray();
            res.send(laptops)
        })

        app.get('/laptop/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const laptop = await laptopCollection.findOne(query)
            res.send(laptop)
        })

    }
    finally {

    }
}
laptop().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Our server is running from heroku')
})

app.listen(port, () => {
    console.log(` listening on port ${port}`)
})

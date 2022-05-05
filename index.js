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

        app.get('/laptops/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const laptop = await laptopCollection.findOne(query)
            res.send(laptop)
        })

        // put method for delivery button
        app.put('/laptops/:id', async (req, res) => {
            const id = req.params.id;
            const updatedValue = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedValue.quantity
                }
            };
            const result = await laptopCollection.updateOne(query, updatedDoc, options);
            res.send(result);

        })
        // put method for restock button
        app.put('/laptops/:id', async (req, res) => {
            const id = req.params.id;
            const updatedValue = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity.quantity
                }
            };
            const result = await laptopCollection.updateOne(query, updatedDoc, options);
            res.send(result);

        })

        app.delete('/laptops/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await laptopCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/laptops', async (req, res) => {
            const newlaptop = req.body;
            const result = await laptopCollection.insertOne(newlaptop);
            res.send(result)
        });

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

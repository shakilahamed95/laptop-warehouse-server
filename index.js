const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()

app.use(cors())
app.use(express.json());


function verifyJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7cgfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function laptop() {
    try {
        await client.connect();
        const laptopCollection = client.db("laptop-house").collection("inventory");
        const myCollection = client.db("laptop-house").collection("myItem");
        const employeeCollection = client.db("laptop-house").collection("employee");
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })

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


        app.post('/myItem', async (req, res) => {
            const myItem = req.body;
            const result = await myCollection.insertOne(myItem)
            res.send(result)
        })
        app.get('/myItem', verifyJwt, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = myCollection.find(query)
                const result = await cursor.toArray();
                res.send(result)
            }
            else {
                res.status(403).send({ message: 'forbidden access' })
            }

        })
        app.delete('/myItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/employee', async (req, res) => {
            const query = {};
            const cursor = employeeCollection.find(query)
            const employee = await cursor.toArray();
            res.send(employee)
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

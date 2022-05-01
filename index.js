const express = require('express')
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Our server is running from heroku')
})

app.listen(port, () => {
    console.log(` listening on port ${port}`)
})

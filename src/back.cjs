const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const port = process.env.PORT || 3000;

const app = express()
app.use(cors());
app.use(express.json());

app.get("/api/geocode/:adress", (req, res) => {
    res.send(req.params.adress);
});

app.listen(port, () => console.log('Server is running on port ' + port + '...'));
app.get('/', (req, res) => {
    res.json('hi');
})
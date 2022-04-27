const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const PORT = 5000;

const exp = express();
exp.use(cors());
exp.listen(PORT, () => console.log("Server is running..."));
exp.get('/', (req, res) => {
    res.json('hi');
})
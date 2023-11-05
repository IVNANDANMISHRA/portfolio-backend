const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser'); // Add this line

dotenv.config();

const app = express();
app.use(cors())
const port = 8000;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

app.use(bodyParser.json()); // Use body-parser to parse JSON requests

app.get('/getContacts', (req, res) => {
    pool.query('SELECT * FROM contacts', (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results.rows);
        }
    });
});

app.post('/addContact', (req, res) => {
    const { name, email,message } = req.body;

    // Insert the data into the 'contacts' table
    const query = 'INSERT INTO contacts (name, email,message) VALUES ($1, $2,$3)';
    const values = [name, email,message];

    pool.query(query,values, (error) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).send('Contact added successfully');
        }
    });
});

app.get("/",async(req,res)=>{
try {
  res.status(200).json({ error: 'Hi Portfolio is up' });
} catch (error) {
  res.status(500).json({ error: 'I am down' });
}});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

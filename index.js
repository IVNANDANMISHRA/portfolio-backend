const express = require('express');
const Redis = require('ioredis');
const app = express();
const port = process.env.PORT || 3000;

// Replace with your KV_URL
const redis = new Redis('redis://default:96608c69411c45b3858558184547daa9@on-goose-45166.upstash.io:45166');

// Middleware for parsing JSON requests
app.use(express.json());

// Store data
app.post('/store', async (req, res) => {
  try {
    const { key, value } = req.body;
    await redis.set(key, value);
    res.status(201).json({ message: 'Data stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error storing data' });
  }
});

// Retrieve data
app.get('/retrieve/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const value = await redis.get(key);
    if (value !== null) {
      res.json({ key, value });
    } else {
      res.status(404).json({ error: 'Key not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

app.get("/",(req,res)=>{
try {
  res.status(200).json({ error: 'Hi Portfolio is up' });
} catch (error) {
  res.status(500).json({ error: 'I am down' });
}
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

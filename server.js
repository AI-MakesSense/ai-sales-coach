require('dotenv').config();
const express = require('express');
const cors = require('cors');
const registerCallHandler = require('./api/register-call');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// This route will receive the request from our frontend
app.post('/api/register-call', async (req, res) => {
  // We pass the request and response objects directly to our existing handler
  await registerCallHandler(req, res);
});

app.listen(port, () => {
  console.log(`[server]: Backend server listening on http://localhost:${port}`);
});

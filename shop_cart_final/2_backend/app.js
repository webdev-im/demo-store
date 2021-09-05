import express from 'express';
import cors from 'cors';
// If using DB: mongoose package (firstly installed with npm and created model for products) and connecting it to your DB

import products from './db/products.js';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.listen(5000);

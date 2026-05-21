const express = require('express');
const { connectDb } = require('./connection');
const { Product } = require('./models');
const app = express();

app.use(express.json());

app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    }
    catch (error) {
        res.status(400).send(error);
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

app.patch('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).send();
        }
        res.send(product);
    }
    catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send();
        }
        res.send(product);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, async () => {
    await connectDb();
    console.log('Server is running on port 3000');
});
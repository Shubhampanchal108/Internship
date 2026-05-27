const express = require('express');
const app = express();

const db = require('./connection');
const { Product, Cart, Order } = require('./models');

const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get("/viewOrders", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('products.product');

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while fetching orders'
        });
    }
});

app.post("/addToCart", async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOneAndUpdate(
            {},
            {
                $push: {
                    products: {
                        product: productId,
                        quantity
                    }
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        res.json(cart);

    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while adding to cart'
        });
    }
});

app.post("/placeOrder", async (req, res) => {
    try {
        const { cartId } = req.body;

        const cart = await Cart.findById(cartId)
            .populate('products.product');

        if (!cart) {
            return res.status(404).json({
                error: 'Cart not found'
            });
        }

        const order = new Order({
            products: cart.products
        });

        const savedOrder = await order.save();

        res.json(savedOrder);

    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while placing order'
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
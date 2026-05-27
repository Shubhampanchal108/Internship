const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        required: true,
        type: String  
    },
    price:{
        required: true,
        type: Number
    },
});

const Product = mongoose.model('Product', productSchema);

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

const odersSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

const Order = mongoose.model('Order', odersSchema);

module.exports = {
    Product,
    Cart,
    Order
};
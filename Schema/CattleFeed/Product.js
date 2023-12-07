const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    attributes: {
        title: String,
        company: String,
        description: String,
        featured: Boolean,
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: Date,
        publishedAt: {
            type: Date,
            default: Date.now
        },
        category: String,
        image: String,
        price: Number,
        shipping: { type: Boolean, default: false },
        packing: Number,
        availableStock: Number,
        colors: { type: [String], default: 'Black' },
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

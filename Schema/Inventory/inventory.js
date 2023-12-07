const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../CattleFeed/Product');

const inventorySchema = new Schema({
    packing: { type: Number },
    availableStock: { type: Number, default: 0 },
    sellStock: { type: Number, default: 0 },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;

const mongoose = require('mongoose');

const paginationSchema = new mongoose.Schema({
    page: Number,
    pageSize: Number,
    pageCount: Number,
    total: Number,
});

const metaSchema = new mongoose.Schema({
    pagination: paginationSchema, 
    categories: [String], 
    companies: [String], 
});

const Meta = mongoose.model('Meta', metaSchema);

module.exports = Meta;

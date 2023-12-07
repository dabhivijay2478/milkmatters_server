const express = require('express');
const router = express.Router();
const Product = require('../Schema/CattleFeed/Product');

// Route to create a new product
router.post('/product-create', async (req, res) => {
    try {
        const productData = req.body;

        if (!productData.attributes.title) {
            return res.status(422).json({ success: false, error: 'Product title is required' });
        }

        const product = new Product(productData);

        await product.save();
        res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to get all products
router.get('/get-products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// Route to update a product
router.put('/product-update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// Route to delete a product
router.delete('/product-delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

router.get('/countProduct', async (req, res) => {
    try {
        const ProductCount = await Product.countDocuments();
        res.status(200).json({ count: ProductCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to count Product' });
    }
});

module.exports = router;

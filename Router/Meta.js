const express = require('express');
const router = express.Router();
const Meta = require('../Schema/Meta'); // Import your Meta model

// Route to create new metadata
router.post('/meta-create', async (req, res) => {
    try {
        const meta = new Meta(req.body);
        await meta.save();
        res.status(201).json({ success: true, message: 'Metadata created successfully', meta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// Route to get metadata
router.get('/get-meta', async (req, res) => {
    try {
        const meta = await Meta.find();
        res.status(200).json({ success: true, meta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// Route to update metadata
router.put('/meta-update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedMeta = await Meta.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedMeta) {
            return res.status(404).json({ success: false, error: 'Metadata not found' });
        }

        res.status(200).json({ success: true, message: 'Metadata updated successfully', updatedMeta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// Route to delete metadata
router.delete('/meta-delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedMeta = await Meta.findByIdAndDelete(id);

        if (!deletedMeta) {
            return res.status(404).json({ success: false, error: 'Metadata not found' });
        }

        res.status(200).json({ success: true, message: 'Metadata deleted successfully', deletedMeta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

module.exports = router;

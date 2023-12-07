const express = require('express');
const router = express.Router();
const User = require('../Schema/User/UserSchema');

// Route to get all farmers
router.get('/get-farmers', async (req, res) => {
    try {
        const farmers = await User.find({ role: 'farmer' }).select('-password -tokens');
        res.json(farmers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

router.get('/get-users', async (req, res) => {
    try {
        const farmers = await User.find({}).select('-password -tokens');
        res.json(farmers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

router.get('/get-veterinarians', async (req, res) => {
    try {
        const veterinarians = await User.find({ role: 'veterinarian' }).select('-password -tokens');
        res.json(veterinarians);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

module.exports = router;

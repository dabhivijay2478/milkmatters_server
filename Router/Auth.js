const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../Schema/User/UserSchema");

// Route to create a new user
router.post("/user-create", async (req, res) => {
    const {
        dairyCode,
        name,
        email,
        address,
        contact,
        role,
        password,
    } = req.body;
    if (!dairyCode || !name || !email || !contact || !role || !password) {
        return res.status(422).json({ success: false, error: "Please fill in all the required fields" });
    }
    try {
        const userExists = await User.findOne({ dairyCode: dairyCode });
        if (userExists) {
            return res.status(422).json({ success: false, error: "User already exists" });
        }
        const user = new User({
            dairyCode,
            name,
            email,
            address,
            contact,
            role,
            password
        });

        await user.save();
        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

// Route to handle user login
router.post("/user-login", async (req, res) => {
    try {
        const { dairyCode, password } = req.body;
        if (!dairyCode || !password) {
            return res.status(400).json({ success: false, error: "Please provide dairyCode and password" });
        }
        const user = await User.findOne({ dairyCode: dairyCode });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {

            console.log("Provided Password:", password);
            console.log("Hashed Password in Database:", user.password);
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }
        const token = await user.generateAuthToken();
        res.cookie("jwttokens", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true,
        });
        res.status(200).json({ success: true, message: "Login successful", role: user.role, userId: user._id, dairyCode: user.dairyCode, name: user.name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, contact, role, email } = req.body;

    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.name = name;
        user.address = address;
        user.contact = contact;
        user.email = email;
        user.role = role;

        await user.save();
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update user' });
    }
});



router.get('/Getuser/:userId', async (req, res) => {
    const { dairyCode, userId } = req.params;
    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userData = {
            _id: user._id,
            dairyCode: user.dairyCode,
            name: user.name,
            address: user.address,
            contact: user.contact,
            role: user.role,
            email: user.email
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.put('/updatePassword/:userId', async (req, res) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



router.delete('/delete-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;


        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/countUsers', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({ count: userCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to count users' });
    }
});


module.exports = router;

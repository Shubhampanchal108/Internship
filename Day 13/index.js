const express = require('express');
const connectDb = require('./connection');
const { user } = require('./models');
require('dotenv').config();

const Port  = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.post("/register", async (req, res) => {
    try {
        const { email, Password } = req.body;
        const newUser = new user({
            email,
            Password
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post ("/login", async (req, res) => {
    try {
        const { email, Password } = req.body;
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (existingUser.Password !== Password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(Port, async () => {
    await connectDb();
    console.log(`Server is running on port ${Port}`);
});
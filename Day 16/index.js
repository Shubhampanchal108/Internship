const express = require('express');
const connectDB = require('./connections');
const User = require('./models');
const jwt = require('jsonwebtoken')
const auth = require('./middleware');

const app = express();

// Connect to MongoDB
connectDB();


app.use(express.json());

// Routes
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login successful", token });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});

app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ message: "Profile retrieved successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving profile", error: err.message });
  }
}); 



app.listen(3000, () => {
  console.log('Server running on port 3000');
});
const User = require('../Models/userModel');

const Login = async(req, res)=>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid email or password"});
        }
        res.status(200).json({message: "Login successful", user});
    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
}

const signUp = async(req, res)=>{
    try{
        const {name, email, password} = req.body;

        const isExistingUser = await User.findOne({email});
        if(isExistingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const user = await User.create({name, email, password});
        if(!user){
            return res.status(400).json({message: "User creation failed"});
        }
        res.status(201).json({message: "User created successfully", user});
    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {
    Login,
    signUp
}
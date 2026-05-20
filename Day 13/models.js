const mongoose = require("mongoose");

const user = new mongoose.Schema({
    email:{
        required: true,
        type: String,
        unique: true
    },
    Password:{
        required: true,
        type: String
    },
}
);


const user = mongoose.model("user", user);

module.exports = {
    user
}
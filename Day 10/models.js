const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
})

const Task = mongoose.model('Task', userSchema);

module.exports = Task;
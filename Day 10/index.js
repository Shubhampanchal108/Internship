const express = require("express")
const connectDB = require("connectDB");
const Task = require("models.js");
const app = express();

connectDB();

app.get("/getAllNotes", ()=>{
    try{
        const tasks = Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.get("/getNote/:id", (req, res)=>{
    try{
        const task = Task.findById(req.params.id);  
        if(!task){
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/createNote", (req, res)=>{
    try{
        const { id, title, content } = req.body;
        const newTask = new Task({ id, title, content });
        newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

app.put("/updateNote/:id", (req, res)=>{
    try{
        const { title, content } = req.body;    
        const task = Task.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        if(!task){
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/deleteNote/:id", (req, res)=>{
    try{
        const task = Task.findByIdAndDelete(req.params.id);
        if(!task){
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(5000, (req, res)=>{
    console.log("Server is listning on port 5000")
})
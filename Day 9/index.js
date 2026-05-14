const express = require('express');
const app = express();
const port = 5000;

app.post("/submit", (req, res)=>{
    try{
        const {name, email, age} = req.body;

        if(!name || email || age){
            return res.json({msg: "missign fields"});
        }

        if(age < 5 || age > 100){
            return res.json({msg: "Invalid Age."})
        }

        return res.json("Data saved successfuly");
    }catch(e){
        console.log(e)
        res.send("Internal server error");
    }
})
app.listen(port, (req, res)=>{
    console.log(`Server is listing on port ${port}`)
})
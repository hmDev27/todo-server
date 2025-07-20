//Imports libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoModel = require('./Models/Todo')

//Creates an Express app
const app = express();

//Middleware setup
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://hmdev27:passwordOf@cluster0.ne2d9oi.mongodb.net/todolist?retryWrites=true&w=majority&appName=Cluster0')

app.get('/get',(req,res) => {
  TodoModel.find()
  .then(result => res.json(result))
  .catch(err => res.json(err))
})

app.put('/update/:id', (req, res) => {
  const {id} = req.params;
  TodoModel.findByIdAndUpdate({_id: id}, {done: true})
  .then(result => res.json(result))
  .catch(err => res.json(err))
})

app.delete('/delete/:id', (req,res) => {
  const {id} = req.params;
  TodoModel.findByIdAndDelete({_id: id})
  .then(result => res.json(result))
  .catch(err => res.json(err))
})

app.post('/add',(req,res) => {
  const task = req.body.task;
  TodoModel.create({
        task: task
  }).then(result => res.json(result))
  .catch(err => res.json(err))
})
app.listen(3001, () => {
  console.log("Server is Running");
});


//28:50
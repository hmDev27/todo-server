//Imports libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoModel = require('./Models/Todo')

const UserModel = require('./Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = "secretkeyOf"

//Creates an Express app
const app = express();

//Middleware setup
app.use(cors());
app.use(express.json());

function verifyUser(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(400).json({ error: "Invalid token" });
  }
}



mongoose.connect('mongodb+srv://hmdev27:passwordOf@cluster0.ne2d9oi.mongodb.net/todolist?retryWrites=true&w=majority&appName=Cluster0')

app.get('/get', verifyUser, (req,res) => {
  TodoModel.find({userId: req.userId})
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

app.post('/add', verifyUser, (req,res) => {
  const task = req.body.task;
  TodoModel.create({
        task: task,
        userId: req.userId
  }).then(result => res.json(result))
  .catch(err => res.json(err))
})
app.listen(3001, () => {
  console.log("Server is Running");
});

//Signup Route
app.post('/register', async (req, res) =>{
  const {email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  UserModel.create({email, password: hash })
  .then(user => res.json(user))
  .catch(err.json(err));
})

//Login Route
app.post('/login', async (req, res) => { 
  const{ email, password } = req.body;
  const user = await UserModel.findOne ({email});
  if (!user) return res.status(400).json({error: "User not found"});

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({error: "Invalid password"});

  const token = jwt.sign({id: user._id}, SECRET);
  res.json({token});
});


//28:50
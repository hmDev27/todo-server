const mongoose = require('mongoose')//Import Mongoose(Hey I want to use Mongoose to talk to MongoDB)

const TodoSchema = new mongoose.Schema({
    task: String,
    done: {
        type: Boolean,
        default: false
    }
})

const TodoModel = mongoose.model("todos", TodoSchema)
module.exports = TodoModel 


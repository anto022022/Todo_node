const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema({
  task_name: { type: String, required: true },
  is_completed: { type: Boolean,  required: true },
});

let todoModel = mongoose.model('todo_list', toDoSchema);

module.exports = todoModel;
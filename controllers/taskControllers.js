const Task = require("../model/taskModel");

const createTask = async (req, res) => {
  const { title, description, due_date, priority, categories } = req.body;
  const { _id } = req.body.user_data;
  if (!title || !description || !due_date || !priority) {
    throw Error("Please fill up the fields");
  }
  try {
    const task = await Task.create({
      user_id: _id,
      title,
      description,
      dueDate: new Date(due_date),
      priority,
      categories: categories.split(","),
    });
    res.status(200).json({ task });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const getTasks = async (req, res) => {
  const { _id } = req.body.user_data;
  try {
    const task = await Task.find({ user_id: _id });
    res.status(200).json({ task });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  const {
    title,
    description,
    due_date,
    priority,
    completed,
    categories,
    task_id,
  } = req.body;
  const complete = completed ? true : false;
  try {
    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    task.completed = complete;
    task.title = title;
    task.description = description;
    task.dueDate = new Date(due_date);
    task.priority = priority;
    task.categories = categories.split(",");

    await task.save();
    res.status(200).json({ task });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { task_id } = req.body;
  console.log(req.body);
  try {
    const task = await Task.deleteOne({ _id: task_id });
    res.status(200).json({ task });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};

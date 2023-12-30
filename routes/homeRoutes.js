const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskControllers");

router.route("/create-task").post(requireAuth, createTask);
router.route("/get-tasks").get(requireAuth, getTasks);
router.route("/update-task").put(requireAuth, updateTask);
router.route("/delete-task").post(requireAuth, deleteTask);

module.exports = router;

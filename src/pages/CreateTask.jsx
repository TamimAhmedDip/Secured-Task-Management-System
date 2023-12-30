import { useLocation, useNavigate } from "react-router-dom";
import style from "../style/CreateTask.module.css";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserApi from "../api/UserApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { formatDateAndTime } from "../utilities/formatDate";
export default function CreateTask() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { editMode } = location.state || false;
  const { task } = location.state || false;

  const [title, setTitle] = useState(false);
  const [description, setDescription] = useState(false);
  const [category, setCategory] = useState(false);
  const [dueDate, setDueDate] = useState(false);
  const [priority, setPriority] = useState(false);
  const { user } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    toast.onChange((payload) => {
      if (payload.status === "removed") {
        // Refresh the page
        navigate("/");
      }
    });
  }, [navigate]);

  async function handleAddTask(e) {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const formData = new FormData(e.target);
    const formDataObject = Object.fromEntries(formData);
    console.log("Form Data Example : ", formDataObject);
    formDataObject["priority"] = parseInt(formDataObject["priority"]);

    try {
      //
      const response = await UserApi.post("/create-task", formDataObject, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      });
      toast.success("Task added successfully...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1200,
      });
      setLoading(false);
      console.log(response.data);
    } catch (err) {
      setError(err.response.data.error);
      setLoading(false);
      //
      console.log(err);
    }
  }
  async function handleUpdateTask(e) {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const formData = new FormData(e.target);
    const formDataObject = Object.fromEntries(formData);

    formDataObject["task_id"] = task._id;
    formDataObject["priority"] = parseInt(formDataObject["priority"]);
    console.log("Form Data Example : ", formDataObject);

    try {
      //
      const response = await UserApi.put("/update-task", formDataObject, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      });
      toast.success("Task updated successfully...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1200,
      });
      setLoading(false);

      console.log(response.data);
    } catch (err) {
      setError(err.response.data.error);
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <>
      <div>
        <h2 style={{ fontSize: "35px", color: "#000" }}>
          {editMode ? `Edit Form` : `Task Creation Form`}
        </h2>
        <form
          onSubmit={!editMode ? handleAddTask : handleUpdateTask}
          className={style["task-form"]}
        >
          <div>
            <label htmlFor="title" style={{ fontSize: "25px", color: "#000" }}>
              Task Title
            </label>
            <input
              required
              type="text"
              name="title"
              id="title"
              value={
                editMode && title === false
                  ? task.title
                  : title === false
                  ? ""
                  : title
              }
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              style={{ fontSize: "25px", color: "#000" }}
            >
              Description
            </label>
            <textarea
              required
              name="description"
              id="description"
              cols="30"
              rows="10"
              value={
                editMode && description === false
                  ? task.description
                  : description === false
                  ? ""
                  : description
              }
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="category"
              style={{ fontSize: "25px", color: "#000" }}
            >
              Category
            </label>
            <input
              required
              type="text"
              name="categories"
              id="category"
              placeholder="Seperate categories with comma (eg. CatA,CatB)"
              value={
                editMode && category === false
                  ? task.categories?.map((category) => category).join(", ")
                  : category === false
                  ? ""
                  : category
              }
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="title" style={{ fontSize: "25px", color: "#000" }}>
              Due Date
            </label>
            <input
              required
              type="date"
              name="due_date"
              id=""
              value={
                editMode && dueDate === false
                  ? formatDateAndTime(task.dueDate).date
                  : dueDate === false
                  ? ""
                  : dueDate
              }
              onChange={(e) => {
                setDueDate(e.target.value);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              style={{ fontSize: "25px", color: "#000" }}
            >
              Priority
            </label>
            <select
              name="priority"
              id="priority"
              value={
                editMode && priority === false
                  ? task.priority
                  : priority === false
                  ? ""
                  : priority
              }
              onChange={(e) => {
                setPriority(e.target.value);
              }}
            >
              <option value={1}>High</option>
              <option value={2}>Medium</option>
              <option value={3}>Low</option>
            </select>
          </div>

          <input
            disabled={loading}
            type="submit"
            value={editMode ? "Update Task" : "Add Task"}
            style={{
              backgroundColor: "lightgreen",
              fontSize: "20px",
            }}
          />
        </form>
      </div>{" "}
      <ToastContainer position="top-right" />
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserApi from "../api/UserApi";
import { useAuthContext } from "../hooks/useAuthContext";
import style from "../style/TaskDetails.module.css";
import { formatDateAndTime } from "../utilities/formatDate";

export default function TaskDetails() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { task } = location.state;
  const { title, description, dueDate, priority, categories, completed } = task;
  const [completeStatus, setCompleteStatus] = useState(completed);
  const { user } = useAuthContext();
  console.log("TASK DETAILS :", task);

  useEffect(() => {
    toast.onChange((payload) => {
      if (payload.status === "removed") {
        // Refresh the page
        navigate("/");
      }
    });
  }, [navigate]);

  async function markAsDone() {
    setError(false);
    setLoading(true);
    const categories = task.categories?.map((category) => category).join(",");
    const dueDate = formatDateAndTime(task.dueDate).date;
    const tempObj = {
      ...task,
      completed: 1,
      task_id: task._id,
      categories,
      due_date: dueDate,
    };
    console.log("Temp obj", tempObj);
    try {
      //
      const response = await UserApi.put("/update-task", tempObj, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      });
      setLoading(false);

      toast.success("Task completed..", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1200, // Time in milliseconds to auto-close the toast (1.5 seconds in this case)
      });

      console.log(response.data);
      setCompleteStatus(true);
    } catch (err) {
      setError(err.response.data.error);
      setLoading(false);
      console.log(err);
    }
  }
  async function deleteTask() {
    setError(false);
    setLoading(true);
    try {
      //
      const response = await UserApi.post(
        "/delete-task",
        { task_id: task._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
        }
      );
      setLoading(false);

      toast.success("Task completed..", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1200, // Time in milliseconds to auto-close the toast (1.5 seconds in this case)
      });

      console.log(response.data);
    } catch (err) {
      setError(err.response.data.error);
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <>
      <div className={style["task-details-page"]}>
        <h2 style={{ fontSize: "35px", color: "#000" }}>{title}</h2>
        <p style={{ fontSize: "25px", color: "#000", marginBottom: "10px" }}>
          <b>Task Description: </b>
          {description}
        </p>
        <p style={{ fontSize: "25px", color: "#000", marginBottom: "10px" }}>
          <b>Due Date: </b>
          {formatDateAndTime(dueDate).date}
        </p>
        <p style={{ fontSize: "25px", color: "#000", marginBottom: "10px" }}>
          <b>Priority: </b>
          {priority}
        </p>
        <p style={{ fontSize: "25px", color: "#000", marginBottom: "10px" }}>
          <b>Categories: </b>
          {categories?.map((category) => category).join(", ")}
        </p>
        <p style={{ fontSize: "25px", color: "#001", marginBottom: "10px" }}>
          <b>Status: </b>
          {completeStatus ? "Done" : "Pending..."}
        </p>
      </div>

      <div className={style["details-button"]}>
        <Link
          to="/create-task"
          state={{
            editMode: true,
            task,
          }}
          className="btn"
        >
          Edit Details
        </Link>
        <button className="btn" onClick={markAsDone} disabled={completeStatus}>
          {completeStatus ? "Already Done" : "Mark As Done"}
        </button>
        <button onClick={deleteTask} className="btn">
          Delete
        </button>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
}

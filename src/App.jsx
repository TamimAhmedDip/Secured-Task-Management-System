import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthContextProvider } from "./Context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CreateTask from "./pages/CreateTask";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TaskDetails from "./pages/TaskDetails";
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<PrivateRoute />}>
            <Route path="" element={<Home />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="task-details" element={<TaskDetails />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;

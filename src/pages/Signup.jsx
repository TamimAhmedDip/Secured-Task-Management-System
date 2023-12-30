import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginSignupApi from "../api/LoginSignupApi";
import classes from "../style/Signup.module.css";
export default function Signup() {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("regular");

  const navigate = useNavigate();

  useEffect(() => {
    toast.onChange((payload) => {
      if (payload.status === "removed") {
        navigate("/login");
      }
    });
  }, [navigate]);

  async function handleSignup(e) {
    e.preventDefault();
    setError(false);
    setLoading(true);

    // Form Data Object
    const formData = new FormData(e.target);
    formData.append("userType", userType);
    const formDataObject = Object.fromEntries(formData);
    console.log("SIGNUP DATA: ", formDataObject);
    try {
      const response = await LoginSignupApi.post("/signup", formDataObject, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      toast.success("Signup Successful !! Navigating to login page...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500, // Time in milliseconds to auto-close the toast (1.5 seconds in this case)
      });
      console.log("SIGNUP: ", response);
      navigate("/login");
    } catch (err) {
      setError(err.response.data.error);
      setLoading(false);

      console.log("SIGNUP: ", err);
    }
    console.log("Handle Signup Function Called");
  }
  return (
    <div className={classes["signup-background"]}>
      <div className={classes["login-form-container"]}>
        <form onSubmit={handleSignup} className={classes["login-form"]}>
          <div className="row mb-3">
            <label htmlFor="userType" className="col-sm-12 col-form-label">
              User Type
            </label>
            <div className="col-sm-12">
              <select
                name="userType"
                className="form-control"
                id="userType"
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                }}
                required
              >
                <option value="regular">Regular</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="fullname" className="col-sm-12 col-form-label">
              Full Name
            </label>
            <div className="col-sm-12">
              <input
                type="text"
                name="fullname"
                className="form-control"
                id="fullname"
                value={fullname}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputEmail3" className="col-sm-12 col-form-label">
              Email
            </label>
            <div className="col-sm-12">
              <input
                name="email"
                type="email"
                className="form-control"
                id="inputEmail3"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <label
              htmlFor="inputPassword3"
              className="col-sm-12 col-form-label"
            >
              Password
            </label>
            <div className="col-sm-12">
              <input
                name="password"
                type="password"
                className="form-control"
                id="inputPassword3"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <label
              htmlFor="inputPassword3"
              className="col-sm-12 col-form-label"
            >
              Confirm Password
            </label>
            <div className="col-sm-12">
              <input
                type="password"
                name="confirm_password"
                className="form-control"
                id="inputPassword3"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                required
              />
            </div>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className={`btn  ${classes["btn-primary"]}`}
          >
            Sign in
          </button>
          <p>
            {`Already have an account?`}{" "}
            <Link className={classes["form-link"]} to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

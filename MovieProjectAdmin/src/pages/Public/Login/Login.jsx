import { useState, useRef, useCallback, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../util/hooks/useDebounce";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [debounceFlag, setDebounceFlag] = useState(false);
  const [loginStatus, setLoginStatus] = useState("idle");
  const navigate = useNavigate();

  const debouncedInputs = useDebounce({ email, password }, 2000);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleInputChange = (e, field) => {
    setDebounceFlag(false);
    setIsDirty(true);
    field === "email" ? setEmail(e.target.value) : setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const credentials = { email, password };
    setLoginStatus("loading");

    try {
      const response = await axios.post("/admin/login", credentials, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      localStorage.setItem("accessToken", response.data.access_token);
      setTimeout(() => {
        setLoginStatus("idle");
        navigate("/main/movies/home");
      }, 3000);
    } catch (error) {
      setTimeout(() => {
        setLoginStatus("idle");
        const errorMessage =
          error.response?.status === 401
            ? "Invalid email or password."
            : "An error occurred. Please try again.";
        alert(errorMessage);
      }, 3000);
    }
  };

  useEffect(() => {
    setDebounceFlag(true);
  }, [debouncedInputs]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h3>Please log in for better experience.</h3>
        <form>
          <div className="form-content">
            <div className="input-group">
              <label>Email:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  ref={emailInputRef}
                  onChange={(e) => handleInputChange(e, "email")}
                  placeholder="Enter your email"
                />
              </div>
              {debounceFlag && isDirty && !email && (
                <span className="error-message">This field is required</span>
              )}
            </div>

            <div className="input-group">
              <label>Password:</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  ref={passwordInputRef}
                  onChange={(e) => handleInputChange(e, "password")}
                  placeholder="Enter your password"
                />
                <span
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {debounceFlag && isDirty && !password && (
                <span className="error-message">This field is required</span>
              )}
            </div>

            <div className="submit-button-wrapper">
              <button
                className="primary-button"
                type="button"
                disabled={loginStatus === "loading"}
                onClick={() => {
                  if (email && password) {
                    setLoginStatus("loading");
                    handleLogin();
                  } else {
                    setIsDirty(true);
                    email === "" && emailInputRef.current.focus();
                    password === "" && passwordInputRef.current.focus();
                  }
                }}
              >
                {loginStatus === "loading" ? (
                  <div className="loading-spinner"></div>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="registration-link">
              <span>Don't have an account? </span>
              <a href="/register">
                <small>Sign Up</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

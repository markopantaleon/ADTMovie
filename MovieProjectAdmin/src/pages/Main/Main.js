import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout? ");
    if (confirmLogout) {
      setIsLoggingOut(true);
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        setIsLoggingOut(false);
        navigate("/login");
      }, 3000);
    }
  };
  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === "" ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    const outlet = document.querySelector(".outlet");
    if (isLoggingOut) {
      outlet.classList.add("fade-out");
    } else {
      outlet.classList.remove("fade-out");
      outlet.classList.add("fade-in");
    }
  }, [isLoggingOut]);

  return (
    <div className="main">
      <div className="container">
        <div className="navigation">
          <ul>
            <li>
              <a onClick={() => navigate("/home")}>Home</a>
            </li>
            {accessToken ? (
              <li className="logout" onClick={handleLogout}>
                Log Out
              </li>
            ) : (
              <li className="login" onClick={() => navigate("/login")}>
                Login
              </li>
            )}
          </ul>
        </div>

        <div className="outlet">
          {isLoggingOut ? <div className="loading-spinner"></div> : <Outlet />}
        </div>
      </div>
    </div>
  );
}

export default Main;

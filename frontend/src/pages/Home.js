import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/dashboard"); // Redirect logged-in users to Dashboard
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <h1>Welcome to Time Bank</h1>
      <p>Exchange time for skills and services!</p>
      <div className="home-buttons">
        <Link to="/register"><button>Register</button></Link>
        <Link to="/login"><button>Login</button></Link>
      </div>
    </div>
  );
}

export default Home;

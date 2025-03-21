import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useState, useEffect } from "react";

const images = [
  "/images/OIP.jpeg", 
  "/images/time-banking.jpg",
  "/images/pic.jpeg",
];

function Dashboard() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome to Time Bank</h1>
      <p className="dashboard-subtitle">Start exchanging your time for valuable services!</p>

      <div className="image-slider">
        <img src={images[currentImage]} alt="Time Bank Exchange" />
      </div>

      <div className="dashboard-buttons-container">
        <div className="dashboard-btn" onClick={() => navigate("/services")}>
          <h3>Browse Services</h3>
          <p>Find and offer services with time credits.</p>
        </div>

        <div className="dashboard-btn" onClick={() => navigate("/transactions")}>
          <h3>View Transactions</h3>
          <p>Track your time credit exchanges and transactions.</p>
        </div>

        <div className="dashboard-btn" onClick={() => navigate("/reviews")}>
          <h3>See Reviews</h3>
          <p>See what others are saying about services.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

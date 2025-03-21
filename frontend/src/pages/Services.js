import { useState, useEffect } from "react";
import { fetchServices, createService } from "../api";
import "./Services.css"; // Import CSS file

function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", time_required: "" });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await fetchServices();
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("You must be logged in to add a service.");
        return;
      }

      const serviceData = { ...form, user_id: user.id };
      await createService(serviceData);
      alert("Service added successfully!");
      setForm({ title: "", description: "", time_required: "" });
      loadServices();
    } catch (err) {
      console.error("Error adding service:", err);
    }
  };

  return (
    <div className="services-container">
      <h2>Available Services</h2>
      <div className="services-list">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p><strong>Time Required:</strong> {service.time_required} min</p>
          </div>
        ))}
      </div>

      <h2>Add a New Service</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <div className="input-group">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      </div>
        <div className="input-group">
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="time_required" placeholder="Time Required (mins)" value={form.time_required} onChange={handleChange} required />
        </div>
        <div className="button-container">
          <button type="submit">Add Service</button>
        </div>
      </form>

    </div>
  );
}

export default Services;

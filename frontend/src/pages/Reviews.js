import { useState } from "react";
import { fetchReviews, submitReview } from "../api";
import "./Reviews.css"; // Import CSS file

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [searchServiceId, setSearchServiceId] = useState(""); // Keeps track of input for loading reviews
  const [form, setForm] = useState({ service_id: "", rating: "", comment: "" });

  const loadReviews = async () => {
    if (!searchServiceId.trim()) {
      alert("Please enter a valid Service ID.");
      return;
    }
    try {
      const res = await fetchReviews(searchServiceId);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("You must be logged in to leave a review.");
        return;
      }

      const reviewData = { ...form, reviewer_id: user.id };
      await submitReview(reviewData);
      alert("Review submitted successfully!");
      setForm({ service_id: "", rating: "", comment: "" });
      loadReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="reviews-container">
      <h2>Service Reviews</h2>
      <div className="review-input-group">
        <input
          name="searchServiceId"
          placeholder="Enter Service ID"
          value={searchServiceId}
          onChange={(e) => setSearchServiceId(e.target.value)}
          required
        />
        <button onClick={loadReviews}>Load Reviews</button>
      </div>

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <p><strong>{review.reviewer}</strong>: {review.comment}</p>
              <p className="review-rating">⭐ {review.rating}/5</p>
            </div>
          ))
        ) : (
          <p className="no-reviews">No reviews yet for this service.</p>
        )}
      </div>

      <h2>Leave a Review</h2>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="input-group">
          <input name="service_id" placeholder="Service ID" value={form.service_id} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="rating" placeholder="Rating (1-5)" value={form.rating} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="comment" placeholder="Comment" value={form.comment} onChange={handleChange} required />
        </div>
        <div className="button-container">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Reviews;

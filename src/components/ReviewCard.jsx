import RatingStars from "./RatingStars";

// # review-card
function ReviewCard({ name, role, avatar, rating, text }) {
  return (
    <div className="review-card">
      <div className="tutor-card-head">
        <img src={avatar} alt={name} className="tutor-avatar" />
        <div>
          <div className="tutor-name">{name}</div>
          <div className="tutor-role">{role}</div>
        </div>
      </div>

      <p className="review-text">{text}</p>

      <RatingStars rating={rating} className="review-rating" />
    </div>
  );
}

export default ReviewCard;

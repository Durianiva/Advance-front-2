function parseRating(value) {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? Math.max(0, Math.min(5, parsed)) : 0;
}

function RatingStars({ rating = 0, showValue = true, className = "" }) {
  const numericRating = parseRating(rating);

  return (
    <span
      className={`rating-stars ${className}`.trim()}
      role="img"
      aria-label={`Rating ${numericRating} dari 5 bintang`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        const isFull = numericRating >= starNumber;
        const isHalf = !isFull && numericRating >= starNumber - 0.5;
        const icon = isFull ? "ri-star-s-fill" : isHalf ? "ri-star-half-s-line" : "ri-star-s-line";
        return <i className={`${icon} ${isFull ? "filled" : isHalf ? "half" : "empty"}`} aria-hidden="true" key={starNumber}></i>;
      })}
      {showValue && <span className="rating-stars-value">{rating}</span>}
    </span>
  );
}

export default RatingStars;

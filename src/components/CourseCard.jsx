import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import "../home.css";

function CourseCard({ id, image, avatar, title, headline, author, authorJob, rating, price }) {
  return (
    <article className="course-card-shell">
      <Link to={`/kelas/${id}`} className="card">
        <div className="card-wrapper-hero-body">
          <div className="card-hero"><img src={image} alt={title} /></div>
          <div className="card-body">
            <div className="card-title">{title}</div>
            <div className="card-headline">{headline}</div>
            <div className="card-info">
              <img src={avatar} alt={`Foto ${author}`} className="card-avatar" />
              <div>
                <div className="card-author">{author}</div>
                <div className="card-author-job">{authorJob}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-end">
          <RatingStars rating={rating} className="card-ratings" />
          <div className="card-price">{price}</div>
        </div>
      </Link>
    </article>
  );
}

export default CourseCard;

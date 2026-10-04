// # tutor-card
function TutorCard({ name, role, company, avatar, bio }) {
  return (
    <div className="tutor-card">
      <div className="tutor-card-head">
        <img src={avatar} alt={name} className="tutor-avatar" />
        <div>
          <div className="tutor-name">{name}</div>
          <div className="tutor-role">
            {role} <b>{company}</b>
          </div>
        </div>
      </div>
      <p className="tutor-bio">{bio}</p>
    </div>
  );
}

export default TutorCard;

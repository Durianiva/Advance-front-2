function CheckoutCourseCard({ course }) {
  if (!course) return null;

  return (
    <aside className="checkout-course-card">
      <img src={course.image} alt={course.title} />
      <h3>{course.title}</h3>
      <div className="checkout-price">
        <b>Rp 250K</b>
        <s>{course.priceOriginal || "Rp 500K"}</s>
        <span>Diskon 50%</span>
      </div>
      <h4>Kelas Ini Sudah Termasuk</h4>
      <div className="checkout-includes">
        {(course.includes || []).map((item) => (
          <span key={item.text}><i className={item.icon}></i> {item.text}</span>
        ))}
      </div>
      <h4>Bahasa Pengantar</h4>
      <p><i className="ri-global-line"></i> {course.language || "Bahasa Indonesia"}</p>
    </aside>
  );
}

export default CheckoutCourseCard;

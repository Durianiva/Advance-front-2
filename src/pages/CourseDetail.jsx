import { useCourses } from "../hooks/useCourses";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TutorCard from "../components/TutorCard";
import CurriculumAccordion from "../components/CurriculumAccordion";
import ReviewCard from "../components/ReviewCard";
import CourseCard from "../components/CourseCard";
import RatingStars from "../components/RatingStars";
import { getMyClass } from "../data/localData";
import "../course-detail.css";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: savedCourses } = useCourses();
  const course = savedCourses.find((item) => item.id === Number(id));
  const ownedClass = getMyClass(id);

  // # kelas-terkait
  const relatedCourses = savedCourses.filter((item) => item.id !== Number(id)).slice(0, 3);

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p style={{ padding: "40px 0" }}>Kelas tidak ditemukan.</p>
          <Link to="/beranda">Kembali ke beranda</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container">
        {/* # breadcrumb */}
        <div className="breadcrumb">
          <Link to="/beranda">Beranda</Link> / <span>{course.breadcrumbCategory}</span> / <span>{course.title}</span>
        </div>

        {/* # hero-kelas */}
        <div className="detail-hero">
          <img src={course.image} alt={course.title} className="detail-hero-bg" />
          <div className="detail-hero-overlay"></div>
          <div className="detail-hero-content">
            <h1>{course.title}</h1>
            <p>{course.tagline}</p>
            <RatingStars rating={course.rating} className="detail-hero-rating" />
          </div>
        </div>

        {/* # konten-dan-sidebar */}
        <div className="detail-layout">
          {/* # konten-utama */}
          <div className="detail-main">
            <section className="detail-section">
              <div className="detail-card">
                <h2>Deskripsi</h2>
                <p>{course.description}</p>
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-card">
                <h2>Belajar Bersama Tutor Profesional</h2>
                <div className="tutor-list">
                  {course.tutors.map((tutor, index) => (
                    <TutorCard key={index} {...tutor} />
                  ))}
                </div>
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-card">
                <h2>Kamu akan Mempelajari</h2>
                <CurriculumAccordion curriculum={course.curriculum} />
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-card">
                <h2>Rating dan Review</h2>
                <div className="review-list">
                  {course.reviews.map((review, index) => (
                    <ReviewCard key={index} {...review} />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* # sidebar-beli */}
          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-title">{course.title}</div>

              <div className="sidebar-price">
                <span className="sidebar-price-now">{course.price}</span>
                <span className="sidebar-price-old">{course.priceOriginal}</span>
                <span className="sidebar-discount-badge">{course.discountLabel}</span>
              </div>

              <div className="sidebar-offer">{course.specialOffer}</div>

              <button className="button-buy" onClick={() => navigate(ownedClass ? `/belajar/${course.id}` : `/pembayaran/${course.id}`)}>
                {ownedClass ? (ownedClass.progress > 0 ? "Lanjutkan Belajar" : "Mulai Belajar") : "Beli Sekarang"}
              </button>

              <div className="sidebar-includes-title">Kelas Ini Sudah Termasuk</div>
              <div className="sidebar-includes">
                {course.includes.map((item, index) => (
                  <div className="sidebar-includes-item" key={index}>
                    <i className={item.icon}></i> {item.text}
                  </div>
                ))}
              </div>

              <div className="sidebar-language-title">Bahasa Pengantar</div>
              <div className="sidebar-language">
                <i className="ri-global-line"></i> {course.language}
              </div>
            </div>
          </aside>
        </div>

        {/* # kelas-terkait-lainnya */}
        <section className="detail-section">
          <h1>Video Pembelajaran Terkait Lainnya</h1>
          <p className="detail-section-subtitle">Ekspansi Pengetahuan Anda dengan Rekomendasi Spesial Kami!</p>
          <div className="section-card">
            {relatedCourses.map((item) => (
              <CourseCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CourseDetail;

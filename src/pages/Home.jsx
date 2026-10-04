import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryFilter from "../components/CategoryFilter";
import ListView from "../components/ListView";
import { categories } from "../data/courses";
import { useCourses } from "../hooks/useCourses";
import beranda from "../assets/images/beranda.jpg";
import news from "../assets/images/news.jpg";
import "../home.css";

function Home() {
  // # state-kategori-aktif
  const [activeCategory, setActiveCategory] = useState("semua");
  const { items: courseList } = useCourses();

  // # filter-course
  const filteredCourses =
    activeCategory === "semua"
      ? courseList
      : courseList.filter((course) => course.category === activeCategory);


  return (
    <>
      <Navbar />

      <main className="container">
        {/* # hero-section */}
        <div className="first-section">
          <img src={beranda} alt="Banner videobelajar" className="first-section-bg" />
          <div className="first-section-overlay"></div>
          <div className="first-section-content">
            <div className="first-section-title">
              Revolusi Pembelajaran: Temukan Ilmu Baru Melalui Platform Video Interaktif!
            </div>
            <p>
              Temukan ilmu baru yang menarik dan mendalam melalui koleksi video pembelajaran berkualitas tinggi.
              Tidak hanya itu, Anda juga dapat berpartisipasi dalam latihan interaktif yang akan meningkatkan
              pemahaman Anda.
            </p>
            <button
              className="button-video-course"
              onClick={() => document.getElementById("daftar-kelas")?.scrollIntoView({ behavior: "smooth" })}
            >
              Temukan Video Course untuk Dipelajari!
            </button>
          </div>
        </div>

        {/* # daftar-course */}
        <div className="second-section" id="daftar-kelas">
          <div className="second-section-title">Koleksi Video Pembelajaran Unggulan</div>
          <p className="second-section-subtitle">Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!</p>

          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <div className="section-card">
            <ListView category={activeCategory} />
          </div>
          {filteredCourses.length === 0 && <p className="empty-state">Belum ada kelas pada kategori ini.</p>}
        </div>

        {/* # newsletter-section */}
        <div className="third-section">
          <img src={news} alt="Newsletter videobelajar" className="third-section-bg" />
          <div className="third-section-overlay"></div>
          <div className="third-section-content">
            <div className="third-section-caption">NEWSLETTER</div>
            <div className="third-section-title">Mau Belajar Lebih Banyak?</div>
            <p>
              Daftarkan dirimu untuk mendapatkan informasi terbaru dan penawaran spesial dari program-program
              terbaik harisenin.com
            </p>

            <div className="form-container">
              <input type="text" className="form-input" placeholder="Masukkan Emailmu" />
              <button className="button-subscribe">Subscribe</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Home;

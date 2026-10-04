import { useCourses } from "../hooks/useCourses";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import { getMyClasses } from "../data/localData";
import "../mission.css";

function MyClasses() {
  const { items: courses } = useCourses();
  const allClasses = getMyClasses();

  const [activeTab, setActiveTab] = useState("Semua Kelas");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredClasses = allClasses.filter((item) => {
    const course = courses.find((data) => data.id === item.courseId);
    const matchTab = activeTab === "Semua Kelas" || item.status === activeTab;
    const matchSearch = course?.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const pageCount = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleClasses = filteredClasses.slice(startIndex, startIndex + itemsPerPage);

  function changeTab(tab) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function changeSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <DashboardSidebar title="Daftar Kelas" subtitle="Akses Materi Belajar dan Mulailah Meningkatkan Pengetahuan Anda!" />
        <section className="dashboard-content list-panel">
          <div className="panel-toolbar">
            <div className="panel-tabs">
              {["Semua Kelas", "Belum Dimulai", "Sedang Berjalan", "Selesai"].map((tab) => (
                <button className={activeTab === tab ? "active" : ""} onClick={() => changeTab(tab)} key={tab}>{tab}</button>
              ))}
            </div>
            <label className="panel-search"><input value={search} onChange={(e) => changeSearch(e.target.value)} placeholder="Cari Kelas" /><i className="ri-search-line"></i></label>
          </div>

          <div className="class-list">
            {visibleClasses.map((item) => {
              const course = courses.find((data) => data.id === item.courseId);
              if (!course) return null;
              return (
                <article className="my-class-card" key={item.courseId}>
                  <div className="class-card-top">
                    <b>{item.completedItemIds?.length || 0} / 12 Aktivitas Terselesaikan</b>
                    <span className={`status ${item.status === "Selesai" ? "success" : item.status === "Sedang Berjalan" ? "progress" : "waiting"}`}>{item.status}</span>
                  </div>
                  <div className="class-card-body">
                    <img src={course.image} alt={course.title} />
                    <div className="class-card-info">
                      <h3>{course.title}</h3>
                      <p>{course.headline}</p>
                      <div className="mini-author"><img src={course.avatar} alt="Tutor" /><span><b>{course.author}</b><small>{course.authorJob} di Gojek</small></span></div>
                      <div className="class-meta"><span><i className="ri-book-2-line"></i> 12 Modul</span><span><i className="ri-time-line"></i> 360 Menit</span></div>
                    </div>
                  </div>
                  <div className="progress-row">
                    <span>Progress Kelas: <b>{item.progress}%</b></span>
                    <div className="progress-track"><span style={{ width: `${item.progress}%` }}></span></div>
                    <Link to={`/belajar/${course.id}`} className="green-button">
                      {item.progress > 0 ? "Lanjutkan Belajar" : "Mulai Pembelajaran"}
                    </Link>
                  </div>
                </article>
              );
            })}
            {filteredClasses.length === 0 && (
              <div className="dashboard-empty"><i className="ri-book-open-line"></i><h3>Belum Ada Kelas</h3><p>Kelas yang sudah dibeli akan muncul di halaman ini.</p></div>
            )}
          </div>
          <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
        </section>
      </main>
      <Footer />
    </>
  );
}

function Pagination({ currentPage, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
        <button className={currentPage === page ? "active" : ""} onClick={() => onPageChange(page)} key={page}>{page}</button>
      ))}
      <button disabled={currentPage === pageCount} onClick={() => onPageChange(currentPage + 1)}>›</button>
    </div>
  );
}

export default MyClasses;

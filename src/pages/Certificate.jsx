import { useCourses } from "../hooks/useCourses";
import { Link, useParams } from "react-router-dom";
import { getMyClass } from "../data/localData";
import "../learning.css";

function Certificate() {
  const { id } = useParams();
  const { items: courseList } = useCourses();
  const course = courseList.find(item => String(item.id) === String(id));
  const classData = getMyClass(id);
  const profile = JSON.parse(localStorage.getItem("videobelajar_profile") || "{}");
  const participant = profile.name || "Morgan Maxwell";
  const completed = classData?.progress === 100;

  if (!course || !completed) return <div className="learning-message"><i className="ri-lock-2-line"></i><h1>Sertifikat belum tersedia</h1><p>Selesaikan 100% aktivitas kelas untuk membuka sertifikat.</p><Link className="learning-primary" to={`/belajar/${id}`}>Kembali Belajar</Link></div>;

  return (
    <div className="certificate-page">
      <header className="certificate-toolbar"><Link to={`/belajar/${id}`}><i className="ri-arrow-left-line"></i> Kembali ke kelas</Link><button className="learning-primary" onClick={() => window.print()}><i className="ri-download-2-line"></i> Download / Cetak PDF</button></header>
      <main className="certificate-card">
        <div className="certificate-decor top"><i></i><i></i><i></i></div><div className="certificate-decor bottom"><i></i><i></i><i></i></div>
        <div className="certificate-brand">videobelajar</div><h1>Certificate</h1><h2>of Completion</h2><p>Proudly presented to</p><div className="certificate-name">{participant}</div><div className="certificate-line"></div><h3>For successfully completing “{course.title}”</h3><p className="certificate-date">Issued on {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(classData.completedAt || Date.now())}</p><div className="certificate-signatures"><div><b>Jenna Ortega</b><span>Course Instructor</span></div><div className="certificate-seal"><i className="ri-award-fill"></i></div><div><b>VideoBelajar</b><span>Learning Director</span></div></div>
      </main>
    </div>
  );
}

export default Certificate;

import { useCourses } from "../hooks/useCourses";
import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import PaymentHeader from "../components/PaymentHeader";
import { completeOrder, getMyClasses, saveMyClasses } from "../data/localData";
import "../mission.css";

function PaymentSuccess() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { items: courseList } = useCourses();
  const course = courseList.find(item => String(item.id) === String(id));
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!course) return;

    completeOrder({ orderId, courseId: course.id });

    const myClasses = getMyClasses();
    if (!myClasses.some((item) => item.courseId === course.id)) {
      saveMyClasses([{ courseId: course.id, progress: 0, status: "Belum Dimulai" }, ...myClasses]);
    }
  }, [course, orderId]);

  return (
    <div className="checkout-page success-page">
      <PaymentHeader step={3} />
      <main className="success-wrap">
        <section className="success-card">
          <div className="success-illustration">
            <i className="ri-bank-card-line"></i>
            <span><i className="ri-check-line"></i></span>
          </div>
          <h1>Pembayaran Berhasil!</h1>
          <p>Silakan cek email kamu untuk informasi lebih lanjut. Hubungi kami jika ada kendala.</p>
          <div className="success-actions">
            <Link to={`/belajar/${course?.id}`} className="green-button">Mulai Belajar</Link>
            <Link to="/pesanan-saya" className="outline-button">Lihat Pesanan</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PaymentSuccess;

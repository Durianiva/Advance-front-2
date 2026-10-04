import { useCourses } from "../hooks/useCourses";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import { failOrder, getOrders } from "../data/localData";
import "../mission.css";

function MyOrders() {
  const { items: courses } = useCourses();
  const [allOrders, setAllOrders] = useState(() => getOrders());
  const [activeTab, setActiveTab] = useState("Semua Pesanan");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredOrders = allOrders.filter((order) => {
    const course = courses.find((item) => item.id === order.courseId);
    const matchTab = activeTab === "Semua Pesanan" || order.status === activeTab;
    const matchSearch = course?.title.toLowerCase().includes(search.toLowerCase()) || order.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

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
        <DashboardSidebar title="Daftar Pesanan" subtitle="Informasi terperinci mengenai pembelian" />
        <section className="dashboard-content list-panel">
          <div className="panel-toolbar order-toolbar">
            <div className="panel-tabs">
              {["Semua Pesanan", "Belum Bayar", "Berhasil", "Gagal"].map((tab) => (
                <button className={activeTab === tab ? "active" : ""} onClick={() => changeTab(tab)} key={tab}>{tab}</button>
              ))}
            </div>
            <label className="panel-search"><input value={search} onChange={(e) => changeSearch(e.target.value)} placeholder="Cari Kelas" /><i className="ri-search-line"></i></label>
          </div>

          <div className="order-list">
            {visibleOrders.map((order) => {
              const course = courses.find((item) => item.id === order.courseId);
              if (!course) return null;
              return (
                <article className="order-card" key={order.id}>
                  <div className="order-head">
                    <span>No. Invoice: <a href="#invoice">{order.id}</a></span>
                    <span>Waktu Pesanan: {order.date}</span>
                    {order.paymentMethod && <span>Metode: {paymentMethodName(order.paymentMethod)}</span>}
                    {order.status === "Belum Bayar" && (
                      <OrderCountdown
                        expiresAt={order.expiresAt}
                        orderId={order.id}
                        onExpire={() => setAllOrders((orders) => orders.map((item) => (
                          item.id === order.id ? { ...item, status: "Gagal" } : item
                        )))}
                      />
                    )}
                    <span className={`status ${statusClass(order.status)}`}>{order.status}</span>
                  </div>
                  <div className="order-body">
                    <div className="order-course"><img src={course.image} alt={course.title} /><b>{course.title}</b></div>
                    <div className="order-price"><span>Harga</span><b>{formatRupiah(order.itemPrice || 300000)}</b></div>
                  </div>
                  <div className="order-total"><span>Total Pembayaran</span><b>{formatRupiah(order.amount || 300000)}</b></div>
                </article>
              );
            })}
            {filteredOrders.length === 0 && (
              <div className="dashboard-empty"><i className="ri-shopping-bag-3-line"></i><h3>Belum Ada Pesanan</h3><p>Pesanan akan muncul setelah Anda menekan Beli Sekarang.</p></div>
            )}
          </div>
          <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
        </section>
      </main>
      <Footer />
    </>
  );
}

function getRemainingSeconds(expiresAt) {
  return Math.max(Math.ceil((Number(expiresAt) - Date.now()) / 1000), 0);
}

function OrderCountdown({ expiresAt, orderId, onExpire }) {
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(expiresAt));

  useEffect(() => {
    if (remaining <= 0) {
      failOrder(orderId);
      onExpire();
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setRemaining(getRemainingSeconds(expiresAt));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [expiresAt, onExpire, orderId, remaining]);

  const hour = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const minute = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const second = String(remaining % 60).padStart(2, "0");

  return <span className="order-countdown"><i className="ri-time-line"></i> {hour}:{minute}:{second}</span>;
}

function statusClass(status) {
  if (status === "Berhasil") return "success";
  if (status === "Gagal") return "failed";
  return "waiting";
}

function paymentMethodName(method) {
  const names = {
    bca: "BCA",
    bni: "BNI",
    bri: "BRI",
    mandiri: "Mandiri",
    dana: "DANA",
    ovo: "OVO",
    gopay: "GoPay",
    linkaja: "LinkAja",
    shopee: "ShopeePay",
    card: "Kartu Kredit/Debit",
  };
  return names[method] || method;
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
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

export default MyOrders;

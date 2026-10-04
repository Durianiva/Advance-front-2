import { NavLink } from "react-router-dom";

function DashboardSidebar({ title, subtitle }) {
  return (
    <aside className="dashboard-side">
      <div className="dashboard-heading">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <nav className="dashboard-menu">
        <NavLink to="/profil"><i className="ri-user-line"></i> Profil Saya</NavLink>
        <NavLink to="/kelas-saya"><i className="ri-book-open-line"></i> Kelas Saya</NavLink>
        <NavLink to="/pesanan-saya"><i className="ri-shopping-bag-3-line"></i> Pesanan Saya</NavLink>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;

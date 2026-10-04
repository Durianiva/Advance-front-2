import { Link } from "react-router-dom";

// # profile-menu
function ProfileMenu({ variant = "dropdown" }) {
  return (
    <div className={variant === "dropdown" ? "category-dropdown" : "mobile-menu-list"}>
      <Link to="/profil">Profil Saya</Link>
      <Link to="/kelas-saya">Kelas Saya</Link>
      <Link to="/pesanan-saya">Pesanan Saya</Link>
      <Link to="/" className="menu-logout">
        Keluar <i className="ri-logout-box-r-line"></i>
      </Link>
    </div>
  );
}

export default ProfileMenu;

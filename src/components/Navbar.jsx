import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/Logo.png";
import loginIcon from "../assets/images/login.png";
import ProfileMenu from "./ProfileMenu";
import "../home.css";

// # navbar
function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const barRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const categoryRef = useRef(null);
  const dropdownRef = useRef(null);

  // # tutup-menu-jika-klik-diluar
  useEffect(() => {
    function handleClickOutside(event) {
      const isClickInsideMobile =
        barRef.current?.contains(event.target) || mobileMenuRef.current?.contains(event.target);
      if (!isClickInsideMobile) {
        setShowMobileMenu(false);
      }

      const isClickInsideDropdown =
        categoryRef.current?.contains(event.target) || dropdownRef.current?.contains(event.target);
      if (!isClickInsideDropdown) {
        setShowCategoryDropdown(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <Link to="/beranda" className="logo-header">
        <img src={logo} alt="videobelajar" />
      </Link>

      {/* # menu-desktop */}
      <ul className="profile">
        <li className="username" ref={categoryRef}>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowCategoryDropdown(!showCategoryDropdown); }}>
            Kategori
          </a>

          {showCategoryDropdown && (
            <div ref={dropdownRef}>
              <ProfileMenu variant="dropdown" />
            </div>
          )}
        </li>
        <li className="avatar">
          <Link to="/profil">
            <img src={loginIcon} alt="Avatar Visitor" />
          </Link>
        </li>
        <li className="bar" ref={barRef} onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <i className="ri-menu-line"></i>
        </li>
      </ul>

      {/* # menu-mobile */}
      <div className={showMobileMenu ? "mobile-menu show" : "mobile-menu"} ref={mobileMenuRef}>
        <ProfileMenu variant="mobile" />
      </div>
    </header>
  );
}

export default Navbar;

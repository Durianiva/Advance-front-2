import { Link } from "react-router-dom";
import logo from "../assets/images/Logo.png";
import "../home.css";

// # footer
function Footer() {
  return (
    <footer className="footer">
      {/* # footer-atas */}
      <div className="first-section-footer">
        <div className="side-left-footer">
          <Link to="/beranda" className="logo-footer">
            <img src={logo} alt="videobelajar" />
          </Link>
          <p className="bold caption-footer">Gali Potensi Anda Melalui Pembelajaran Video di hariesok.id!</p>
          <p className="address-footer">Jl. Usman Effendi No. 50 Lowokwaru, Malang +62-877-7123-1234</p>
        </div>

        <div className="side-right-footer">
          <div className="wrapper-menu-footer">
            <span className="title-menu-footer">Kategori</span>
            <ul className="category">
              <li>Digital & Teknologi</li>
              <li>Pemasaran</li>
              <li>Manajemen Bisnis</li>
              <li>Pengembangan Diri</li>
              <li>Desain</li>
            </ul>
          </div>

          <div className="wrapper-menu-footer">
            <span className="title-menu-footer">Perusahaan</span>
            <ul className="company">
              <li>Tentang Kami</li>
              <li>FAQ</li>
              <li>Kebijakan Privasi</li>
              <li>Ketentuan Layanan</li>
              <li>Bantuan</li>
            </ul>
          </div>

          <div className="wrapper-menu-footer">
            <span className="title-menu-footer">Komunitas</span>
            <ul className="community">
              <li>Tips Sukses</li>
              <li>Blog</li>
            </ul>
          </div>
        </div>
      </div>

      {/* # footer-bawah */}
      <div className="second-section-footer">
        <ul className="footer-menu">
          <li>
            <div className="wrapping-footer-menu">
              <b>Perusahaan</b>
              <i className="ri-arrow-right-wide-line"></i>
            </div>
          </li>
          <li>
            <div className="wrapping-footer-menu">
              <b>Perusahaan</b>
              <i className="ri-arrow-right-wide-line"></i>
            </div>
          </li>
          <li>
            <div className="wrapping-footer-menu">
              <b>Komunitas</b>
              <i className="ri-arrow-right-wide-line"></i>
            </div>
          </li>
        </ul>

        <div className="footer-divider"></div>

        <div className="end-footer">
          <p className="copyright">@2023 Gerobak Sayur All Rights Reserved.</p>

          <ul className="social">
            <li><i className="ri-linkedin-fill"></i></li>
            <li><i className="ri-facebook-fill"></i></li>
            <li><i className="ri-instagram-line"></i></li>
            <li><i className="ri-twitter-x-line"></i></li>
            <li><i className="ri-tiktok-fill"></i></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

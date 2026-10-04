import { Link } from "react-router-dom";
import logo from "../assets/images/Logo.png";
import "../register.css";

// # auth-header
function AuthHeader() {
  return (
    <header className="auth-header">
      <Link to="/" className="auth-logo">
        <img src={logo} alt="videobelajar" />
      </Link>
    </header>
  );
}

export default AuthHeader;

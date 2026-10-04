import { Link } from "react-router-dom";
import logo from "../assets/images/Logo.png";

function PaymentHeader({ step = 1 }) {
  return (
    <header className="payment-header">
      <Link to="/beranda" className="payment-logo"><img src={logo} alt="videobelajar" /></Link>
      <div className="payment-steps">
        <div className={step >= 1 ? "step active" : "step"}><span>✓</span> Pilih Metode</div>
        <div className="step-line"></div>
        <div className={step >= 2 ? "step active" : "step"}><span>{step >= 2 ? "✓" : "2"}</span> Bayar</div>
        <div className="step-line"></div>
        <div className={step >= 3 ? "step active" : "step"}><span>{step >= 3 ? "✓" : "3"}</span> Selesai</div>
      </div>
    </header>
  );
}

export default PaymentHeader;

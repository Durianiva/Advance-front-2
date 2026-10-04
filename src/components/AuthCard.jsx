import { Link } from "react-router-dom";

// # auth-card
function AuthCard({ title, tagline, children, secondaryText, secondaryLink }) {
  return (
    <div className="auth-container">
      <div className="column">
        <div className="auth-card">
          {/* # card-header */}
          <div className="auth-card-header">
            <h2>{title}</h2>
            <div className="tagline">{tagline}</div>
          </div>

          {/* # card-body */}
          <div className="auth-card-body">
            {children}

            <div className="btn-secondary">
              <Link to={secondaryLink}>{secondaryText}</Link>
            </div>

            {/* # divider-sso */}
            <div className="divider-sso">
              <div className="border-line"></div>
              <div className="divider-text">atau</div>
              <div className="border-line"></div>
            </div>

            {/* # tombol-google */}
            <div>
              <button type="button" className="button-google" onClick={() => alert("Masuk dengan Google belum terhubung ke server. Silakan sambungkan proses OAuth Google di sini.")}>
                <i className="ri-google-fill"></i> Masuk dengan Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;

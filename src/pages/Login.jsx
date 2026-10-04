import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import PasswordField from "../components/PasswordField";
import "../register.css";

function Login() {
  const navigate = useNavigate();

  // # state-form-login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // # handle-submit
  function handleSubmit(e) {
    e.preventDefault();
    const passwordRule = /^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/;

    if (!email.trim() || !password.trim()) {
      setError("E-mail dan kata sandi wajib diisi.");
      return;
    }

    if (!passwordRule.test(password)) {
      setError("Kata sandi minimal 8 karakter dan harus berisi kombinasi huruf serta angka.");
      return;
    }

    setError("");
    navigate("/beranda");
  }

  return (
    <>
      <AuthHeader />

      <AuthCard
        title="Masuk ke Akun"
        tagline="Yuk, lanjutkan belajarmu di videobelajar"
        secondaryText="Daftar"
        secondaryLink="/register"
      >
        <form onSubmit={handleSubmit}>
          <FormField label="E-Mail" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <PasswordField
            label="Kata Sandi"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Minimal 8 karakter, gunakan kombinasi huruf dan angka."
          />

          {error && <p className="auth-message error" role="alert">{error}</p>}

          <div className="forgot-password">Lupa Password?</div>

          <div className="btn-primary">
            <button type="submit">Masuk</button>
          </div>
        </form>
      </AuthCard>
    </>
  );
}

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import PasswordField from "../components/PasswordField";
import { PROFILE_KEY, REGISTERED_USER_KEY } from "../data/localData";
import "../register.css";
import "../mission.css";

const countries = [
  { id: "id", name: "Indonesia", code: "+62" },
  { id: "my", name: "Malaysia", code: "+60" },
  { id: "sg", name: "Singapura", code: "+65" },
  { id: "ph", name: "Filipina", code: "+63" },
  { id: "th", name: "Thailand", code: "+66" },
];

function Register() {
  const navigate = useNavigate();

  // # state-form-register
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [countryId, setCountryId] = useState("id");
  const [showCountries, setShowCountries] = useState(false);
  const selectedCountry = countries.find((country) => country.id === countryId);

  // # handle-submit
  function handleSubmit(e) {
    e.preventDefault();
    const passwordRule = /^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/;

    if (!fullName.trim() || !email.trim() || !gender || !noHp.trim() || !password || !passwordConfirmation) {
      setError("Semua data pendaftaran wajib diisi.");
      return;
    }

    if (!passwordRule.test(password)) {
      setError("Kata sandi minimal 8 karakter dan harus berisi kombinasi huruf serta angka.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Konfirmasi kata sandi belum sama.");
      return;
    }

    const registeredUser = {
      fullName: fullName.trim(),
      email: email.trim(),
      gender,
      noHp,
      countryCode: selectedCountry.code,
    };

    localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(registeredUser));
    localStorage.setItem(PROFILE_KEY, JSON.stringify({
      name: registeredUser.fullName,
      email: registeredUser.email,
      phone: registeredUser.noHp,
      countryCode: registeredUser.countryCode,
    }));
    setError("");
    navigate("/");
  }

  return (
    <>
      <AuthHeader />

      <AuthCard
        title="Pendaftaran Akun"
        tagline="Yuk, daftarin akunmu sekarang juga!"
        secondaryText="Masuk"
        secondaryLink="/login"
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Nama Lengkap" id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

          <FormField label="E-Mail" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          {/* # pilih-gender */}
          <div className="input-field">
            <label htmlFor="gender" className="form-label">
              Jenis Kelamin <b>*</b>
            </label>
            <div className="wrapping-select">
              <select
                name="gender"
                id="gender"
                className="auth-form-input custom-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled>Pilih jenis kelamin</option>
                <option value="1">Wanita</option>
                <option value="2">Laki-Laki</option>
              </select>
            </div>
          </div>

          {/* # nomor-hp */}
          <div className="input-field">
            <label htmlFor="no_hp" className="form-label">
              No. Hp <b>*</b>
            </label>
            <div className="wrapping-number">
              <div className="country-picker">
                <button
                  type="button"
                  className="country-picker-button"
                  onClick={() => setShowCountries(!showCountries)}
                  aria-expanded={showCountries}
                  aria-label="Pilih negara dan kode telepon"
                >
                  <span className={`flag-icon flag-${selectedCountry.id}`} aria-hidden="true"></span>
                  <span>{selectedCountry.code}</span>
                  <i className={showCountries ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                </button>

                {showCountries && (
                  <div className="country-menu" role="listbox">
                    {countries.map((country) => (
                      <button
                        type="button"
                        className={country.id === countryId ? "country-option active" : "country-option"}
                        onClick={() => {
                          setCountryId(country.id);
                          setShowCountries(false);
                        }}
                        key={country.id}
                      >
                        <span className={`flag-icon flag-${country.id}`} aria-hidden="true"></span>
                        <span className="country-name">{country.name}</span>
                        <span>{country.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                className="auth-form-input"
                name="no_hp"
                id="no_hp"
                placeholder="8xxxxxxxxxx"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                required
                inputMode="numeric"
                pattern="[0-9]{9,13}"
                title="Nomor HP harus terdiri dari 9 sampai 13 angka."
              />
            </div>
          </div>

          <PasswordField
            label="Kata Sandi"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Minimal 8 karakter, gunakan kombinasi huruf dan angka."
          />

          <PasswordField
            label="Konfirmasi Kata Sandi"
            id="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            helperText="Masukkan kembali kata sandi yang sama."
          />

          {error && <p className="auth-message error" role="alert">{error}</p>}

          <div className="forgot-password">Lupa Password?</div>

          <div className="btn-primary">
            <button type="submit">Daftar</button>
          </div>
        </form>
      </AuthCard>
    </>
  );
}

export default Register;

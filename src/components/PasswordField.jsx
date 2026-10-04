import { useState } from "react";

// # password-field
function PasswordField({ label, id, value, onChange, helperText }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-field">
      <label htmlFor={id} className="form-label">
        {label} <b>*</b>
      </label>
      <div className="wrapping-password-child">
        <input
          type={showPassword ? "text" : "password"}
          className="auth-form-input"
          name={id}
          id={id}
          value={value}
          onChange={onChange}
          required
          minLength="8"
          pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,}"
          title="Password minimal 8 karakter dan harus berisi huruf serta angka."
        />
        <button
          type="button"
          className="password-toggle-icon"
          aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={showPassword}
          onClick={() => setShowPassword(!showPassword)}
        >
          <i aria-hidden="true" className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
        </button>
      </div>
      {helperText && <small className="password-helper">{helperText}</small>}
    </div>
  );
}

export default PasswordField;

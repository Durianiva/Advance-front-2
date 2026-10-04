// # form-field
function FormField({ label, id, type = "text", value, onChange, placeholder, ...inputProps }) {
  return (
    <div className="input-field">
      <label htmlFor={id} className="form-label">
        {label} <b>*</b>
      </label>
      <input
        type={type}
        className="auth-form-input"
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...inputProps}
      />
    </div>
  );
}

export default FormField;

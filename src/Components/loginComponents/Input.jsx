import styles from "./Input.module.css";

function Input({ setState, placeholder, value, disabled, type, signup, name }) {
  const inputName = `${signup ? "register":"login"}-${name}`
  return (
    <>
      <label htmlFor={inputName}></label>
      <input
        name={inputName}
        id={inputName}
        autoComplete={
          type === "user"
            ? "username"
            : signup
              ? "new-password"
              : "current-password"
        }
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(ev) => setState(ev.target.value)}
        disabled={disabled}
        minLength={type === "password" ? 8 : 2}
        maxLength={100}
        required
      />
    </>
  );
}

export default Input;

import styles from "./Input.module.css";

function Input({ setState, placeholder, value, disabled, type, signup }) {
  const name = `${type}-${signup ? "register" : "password"}`;
  return (
    <input
      name={name}
      id={name}
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
      required
    />
  );
}

export default Input;

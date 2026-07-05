import styles from "./Input.module.css";

function Input({ setState, placeholder, value, disabled, type }) {
  return (
    <input
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

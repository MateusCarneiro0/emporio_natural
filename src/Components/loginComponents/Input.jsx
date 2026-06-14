import styles from "./Input.module.css";

function Input({ setState, placeholder, value, disabled }) {
  return (
    <input
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

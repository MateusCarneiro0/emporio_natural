import styles from "./Input.module.css";

function Input({ setState, placeholder, value }) {
  return (
    <input
      className={styles.input}
      placeholder={placeholder}
      value={value}
      onChange={(ev) => setState(ev.target.value)}
    />
  );
}

export default Input;

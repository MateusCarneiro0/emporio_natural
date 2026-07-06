import styles from "./Button.module.css";

function Button({ children, onClick }) {
  return (
    <button aria-label={children} onClick={onClick} className={styles.button}>
      <span>{children}</span>
    </button>
  );
}

export default Button;

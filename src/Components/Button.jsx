import styles from "./Button.module.css";

function Button({ children, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      aria-label={children}
      onClick={onClick}
      className={styles.button}
    >
      <span>{children}</span>
    </button>
  );
}

export default Button;

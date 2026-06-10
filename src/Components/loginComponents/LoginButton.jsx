import styles from "./LoginButton.module.css";

function LoginButton({ children, color, backgroundColor, onClick,disabled }) {
  return (
    <button
      onClick={onClick}
      className={styles.button}
      style={{ color, backgroundColor }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default LoginButton;

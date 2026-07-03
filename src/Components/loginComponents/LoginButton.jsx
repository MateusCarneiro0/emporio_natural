import styles from "./LoginButton.module.css";

function LoginButton({ children, disabled, register }) {
  return (
    <button
      type="submit"
      className={`${styles.button} ${register ? styles.register:styles.login}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default LoginButton;

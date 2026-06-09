import styles from "./LoginButton.module.css";

function LoginButton({ children, color, backgroundColor }) {
  return (
    <button className={styles.button} style={{ color, backgroundColor }}>
      {children}
    </button>
  );
}

export default LoginButton;

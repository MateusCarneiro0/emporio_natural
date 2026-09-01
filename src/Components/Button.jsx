import styles from "./Button.module.css";

function Button({ children, onClick, disabled, id,ariaLabel }) {
  if (id)
    return (
      <button
        id={id}
        disabled={disabled}
        aria-label={ariaLabel ? `${children} ${ariaLabel}`: children}
        onClick={onClick}
        className={styles.button}
      >
        <span>{children}</span>
      </button>
    );
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

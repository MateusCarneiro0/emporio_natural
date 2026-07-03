import styles from "./NotFoundMain.module.css";

function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.code}>404</h1>
      <h3 className={styles.message}>
        A rota especificada não existe tente outra rota
      </h3>
    </div>
  );
}

export default NotFound;

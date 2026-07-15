import styles from "./Error.module.css";

function Error({ message }) {
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.message}>Ocorreu um erro 😭</h2>
      <h3 className={styles.errorMessage}>
        {message ? message : "Um erro ocorreu tente denovo"}
      </h3>
    </div>
  );
}

export default Error;

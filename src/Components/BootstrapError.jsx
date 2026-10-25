import styles from "./Error.module.css";

function BootstrapError() {
  return (
    <div>
      <>
        <div className={styles.errorContainer}>
          <h2 className={styles.message}>Ocorreu um erro 😭</h2>
          <h3 className={styles.errorMessage}>
             Um erro ocorreu! Recarregue a página 
          </h3>
          <button
            aria-label="Voltar ao início e recarregar página"
            onClick={() => window.location.reload()}
            className={styles.button}
          >
            Recarregar página
          </button>
        </div>
      </>
    </div>
  );
}

export default BootstrapError;

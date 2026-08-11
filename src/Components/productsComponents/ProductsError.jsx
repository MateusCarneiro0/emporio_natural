import styles from "./ProductsError.module.css";
import { useParams, useRevalidator } from "react-router";

function ProductsError({ message }) {
  const { id } = useParams();
  const { revalidate, state } = useRevalidator();

  const handleReturn = (ev) => {
    ev.preventDefault();
    revalidate();
  };
  const isLoading = state === "loading";
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.message}>Ocorreu um erro 😭</h2>
      <h3 className={styles.errorMessage}>
        {message ? message : "Um erro em procurar produtos aconteceu"}
      </h3>
      <button
        disabled={isLoading}
        aria-label={id ? "Buscar produto novamente" : "Buscar produtos"}
        onClick={handleReturn}
        className={styles.button}
      >
        {isLoading
          ? id
            ? "Buscar produto novamente"
            : "Buscar produtos"
          : "Carregando"}
      </button>
    </div>
  );
}

export default ProductsError;

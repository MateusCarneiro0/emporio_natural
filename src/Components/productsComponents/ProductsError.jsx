import { useDispatch } from "react-redux";
import styles from "./ProductsError.module.css";
import { useParams } from "react-router";
import { fetchProducts, getProduct } from "../../api/productsApi";

function ProductsError({ message }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleReturn = (ev) => {
    ev.preventDefault();
    if (id) {
      dispatch(getProduct(id));
    } else {
      dispatch(fetchProducts());
    }
  };
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.message}>Ocorreu um erro 😭</h2>
      <h3 className={styles.errorMessage}>
        {message ? message : "Um erro em procurar produtos aconteceu"}
      </h3>
      <button
        aria-label={id ? "Buscar produto novamente":"Buscar produtos"}
        onClick={handleReturn}
        className={styles.button}
      >
        {id ? "Buscar produto novamente":"Buscar produtos"}
      </button>
    </div>
  );
}

export default ProductsError;

import { useNavigate } from "react-router-dom";
import styles from "./CardProduct.module.css";

function CardProduct({ src, title, children, categorias, price,id }) {
  const navigate = useNavigate()

  return (
    <div className={styles.card} onClick={() => navigate(`${id}`)}>
      <img src={src} alt={title} />
      <h3>{title}</h3>
      <p className={styles.description}>{children}</p>
      <p className={styles.price}>
        <strong>{price} R$/Kg</strong>
      </p>
      <button>Adicione ao carrinho</button>
    </div>
  );
}

export default CardProduct;

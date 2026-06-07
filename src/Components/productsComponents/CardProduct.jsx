import { useNavigate } from "react-router-dom";
import styles from "./CardProduct.module.css";
import Button from "../Button";

function CardProduct({ src, title, children, categorias, price, id }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <img src={src} alt={title} />
      <h3>{title}</h3>
      <p className={styles.description}>{children}</p>
      <p className={styles.price}>
        <strong>{price} R$/Kg</strong>
      </p>
      <Button onClick={() => navigate(`${id}`)}>Veja mais</Button>
    </div>
  );
}

export default CardProduct;

import { useNavigate } from "react-router";
import styles from "./CardProduct.module.css";
import Button from "../Button";
import { memo } from "react";
import { useSelector } from "react-redux";
const CardProduct = memo(function CardProduct({
  src,
  title,
  children,
  categorias,
  price,
  id,
  categoria,
  isLast
}) {
  const navigate = useNavigate();
  const {isAuthenticated} = useSelector(store => store.auth)
  function handleClick(ev) {
    ev.preventDefault()
    navigate(isAuthenticated ? `${id}`:"/login")
  }
  return (
    <div className={`${styles.card} ${isLast ? styles.last:""}`}>
      <img src={src} alt={title} />
      <h3>{title}</h3>
      <p className={styles.description}>{children}</p>
      <p className={styles.price}>
        <strong>
          {price} R$/{categoria}
        </strong>
      </p>
      <Button onClick={handleClick} id={`product-${title}`} ariaLabel={`sobre ${title}`}>Veja mais</Button>
    </div>
  );
});

export default CardProduct;

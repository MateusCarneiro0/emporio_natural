import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { deleteProductCart } from "../../api/cartApi";

import styles from "./CartCard.module.css";
function CartCard({
  src,
  children,
  price,
  productId,
  quantity,
  isLast,
  categoria,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className={`${styles.cartCard} ${isLast ? styles.last : ""}`}>
      <div
        className={styles.card}
        onClick={(ev) => {
          ev.preventDefault();
          navigate(`/produtos/${productId}`);
        }}
      >
        <img src={src} alt={children} />
        <h3>{children}</h3>
        <p className={styles.price}>
          <strong>{price} R$</strong>
        </p>
        <p className={styles.quantity}>
          {quantity} {categoria}
        </p>
      </div>
      <button
        className={styles.button}
        onClick={(ev) => {
          ev.preventDefault();
          dispatch(deleteProductCart(productId));
        }}
      >
        &times;
      </button>
    </div>
  );
}

export default CartCard;

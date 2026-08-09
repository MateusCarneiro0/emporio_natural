import { Link } from "react-router";
import { useDispatch } from "react-redux";

import { deleteProductCart } from "../../api/cartApi";

import styles from "./CartCard.module.css";
function CartCard({ src, children, price, productId, quantity, categoria }) {
  const dispatch = useDispatch();
  return (
    <div className={`${styles.cartContainer}`}>
      <Link to={`/produtos/${productId}`} className={styles.card}>
        <img src={src} alt={children} />
        <h3>{children}</h3>
        <p className={styles.price}>
          <strong>{price} R$</strong>
        </p>
        <p className={styles.quantity}>
          {quantity} {categoria}
        </p>
        <button
          aria-label="Apagar produto do carrinho"
          className={styles.button}
          onClick={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            dispatch(deleteProductCart(productId));
          }}
        >
          &times;
        </button>
      </Link>
    </div>
  );
}

export default CartCard;

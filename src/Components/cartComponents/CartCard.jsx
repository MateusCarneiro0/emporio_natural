import { Link } from "react-router";
import { useDispatch } from "react-redux";
import React from "react";

import styles from "./CartCard.module.css";
import { useDeleteProductCartMutation } from "../../api/appApi";
function CartCard({ src, children, price, productId, quantity, categoria }) {
  const [deleteProduct, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteProductCartMutation();
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
        {!isDeleting && (
          <button
            aria-label={`Apagar ${children} do carrinho`}
            className={styles.button}
            onClick={async (ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              await deleteProduct({ id: productId })
                .unwrap()
                .then((pay) => console.log(`sucessfully: ${pay}`))
                .catch((error) => console.error(error));
            }}
          >
            &times;
          </button>
        )}
      </Link>
    </div>
  );
}

export default CartCard;

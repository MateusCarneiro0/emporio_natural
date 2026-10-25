import { Link } from "react-router";

import styles from "./CartCard.module.css";
import { useDeleteProductCartMutation } from "../../api/appApi";
import { createToast } from "../../utils/createToast";

function CartCard({ src, children, price, productId, quantity, categoria }) {
  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductCartMutation();
  const handleClick = async (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    await deleteProduct({ id: productId })
      .unwrap()
      .then(() => {
        createToast(
          `O produto ${children} foi removido com sucesso`,
          true,
          `deleted-product-${children}`,
        );
      })
      .catch((error) => {
        console.error(error);
        createToast(
          `O produto ${children} não pôde ser removido`,
          false,
          `deleted-product-${children}`,
          7000,
        );
      });
  };

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
        {
          <button
            aria-label={`Apagar ${children} do carrinho`}
            className={styles.button}
            onClick={handleClick}
          >
            {isDeleting ? "...":"×"}
          </button>
        }
      </Link>
    </div>
  );
}

export default CartCard;

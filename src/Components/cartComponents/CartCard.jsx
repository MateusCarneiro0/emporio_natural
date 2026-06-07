import styles from "./CartCard.module.css";
function CartCard({ src, children, price }) {
  return (
    <div className={styles.card}>
      <img src={src} alt={children} />
      <h3>{children}</h3>
      <p className={styles.price}>
        <strong>{price} R$/Kg</strong>
      </p>
      <button>&times;</button>
    </div>
  );
}

export default CartCard;

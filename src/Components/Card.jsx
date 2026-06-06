import styles from "./Card.module.css";
function Card({ src, children, id, right, isLast }) {
  return (
    <div
      data-aos={`fade-up-${right ? "right" : "left"}`}
      className={` ${isLast ? styles.last : ""} ${styles.card} ${right ? styles.right : styles.left}`}
    >
      <img src={src} alt={id} />
      <p>{children}</p>
    </div>
  );
}

export default Card;

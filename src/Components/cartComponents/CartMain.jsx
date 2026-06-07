import { useSelector } from "react-redux";
import CartCard from "./CartCard";
import styles from "./CartMain.module.css";
import { ThreeDots } from "react-loader-spinner";
import Error from "../Error";
function CartMain() {
  const { cartProducts, isLoading, error } = useSelector((store) => store.cart);

  if (isLoading) return <ThreeDots />;
  if (error) return <Error />;
  return (
    <div className={styles.cart}>
      <CartCard src="/icons/icon_1.png" price={25}>
        Banana Prata
      </CartCard>
      {cartProducts.map((product) => (
        <CartCard src={product.imagem} price={product.total}>
          {product.nome}
        </CartCard>
      ))}
    </div>
  );
}

export default CartMain;

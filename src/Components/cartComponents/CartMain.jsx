import { useDispatch, useSelector } from "react-redux";

import { payCart } from "../../api/cartApi";
import Button from "../Button";
import CartCard from "./CartCard";

import Error from "../Error";
import Spinner from "../Spinner";

import styles from "./CartMain.module.css";

function CartMain() {
  const { cartProducts, isLoading, error } = useSelector((store) => store.cart);
  const dispatch = useDispatch();

  const totalCust = Number(
    cartProducts?.reduce((prev, cur) => prev + cur.total, 0).toFixed(2),
  );

  if (isLoading) return <Spinner message="Carregando Carrinho..." />;
  if (error) return <Error />;

  if (!cartProducts?.length)
    return (
      <div
        className={styles.enoughProducts}
      >
        <h2>
          Hey 👋,vamos adicionar algum produto?
        </h2>
      </div>
    );
  return (
    <div className={styles.cart}>
      {cartProducts?.map((product) => (
        <CartCard
          key={product.id}
          src={product.imagem}
          price={product.total}
          productId={product.id}
          quantity={product.quantity}
          categoria={product.categoria}
        >
          {product.nome}
        </CartCard>
      ))}
      <hr style={{ marginTop: "15px", marginBottom: "15px" }} />
      <h2 style={{ color: "rgb(192, 195, 137)" }}>
        Total:<strong>{totalCust} R$</strong>
      </h2>
      <Button onClick={() => dispatch(payCart())}>Pagar o carrinho</Button>
    </div>
  );
}

export default CartMain;

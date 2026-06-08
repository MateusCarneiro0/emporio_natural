import { useDispatch, useSelector } from "react-redux";
import CartCard from "./CartCard";
import styles from "./CartMain.module.css";
import { ThreeDots } from "react-loader-spinner";
import Error from "../Error";
import { useEffect } from "react";
import { fetchCart, payCart } from "../features/cartSlice";
import Button from "../Button";
function CartMain() {
  const { cartProducts, isLoading, error, userId } = useSelector(
    (store) => store.cart,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart(userId));
  }, [dispatch, userId]);

  const totalCust = cartProducts?.reduce((prev, cur) => prev + cur.total, 0);

  if (isLoading) return <ThreeDots />;
  if (error) return <Error />;
  if (!cartProducts?.length)
    return (
      <div
        style={{
          marginBottom: "70vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h2 style={{ color: "rgb(192, 195, 137)" }}>
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

import { useDispatch, useSelector } from "react-redux";

import { payCart } from "../../api/cartApi";
import Button from "../Button";
import CartCard from "./CartCard";

import Spinner from "../Spinner";

import styles from "./CartMain.module.css";
import ToastAlert from "./ToastAlert";
import { useEffect } from "react";
import { cleanOperationText } from "../../slices/cartSlice";

function CartMain() {
  const { cartProducts, isLoading, error, operationText } = useSelector(
    (store) => store.cart,
  );
  const dispatch = useDispatch();

  const totalCust = Number(
    (cartProducts?.length
      ? cartProducts.reduce((prev, cur) => prev + (cur?.total || 0), 0)
      : 0
    ).toFixed(2),
  );
  useEffect(() => {
    if (!operationText) return;

    const toastInterval = setInterval(
      () => dispatch(cleanOperationText()),
      6000,
    );

    return () => clearInterval(toastInterval);
  }, [operationText, dispatch]);
  if (isLoading) return <Spinner message="Carregando Carrinho..." />;

  if (!cartProducts?.length)
    return (
      <>
        <div className={styles.enoughProducts}>
          <h2>
            Hey 👋,você não colocou nada no carrinho.{" "}
            <strong>Vamos adicionar algum produto?</strong>
          </h2>
        </div>
        {operationText && (
          <ToastAlert text={operationText} error={Boolean(error)} />
        )}
      </>
    );
  return (
    <>
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
      {operationText && (
        <ToastAlert text={operationText} error={Boolean(error)} />
      )}
    </>
  );
}

export default CartMain;

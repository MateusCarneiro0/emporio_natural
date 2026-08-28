import { useState } from "react";

import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import Error from "../Error";
import Button from "../Button";

import styles from "./Product.module.css";
import { addProductCart } from "../../api/cartApi";
import Spinner from "../Spinner";

function Product() {
  const [quantity, setQuantity] = useState("");

  const { isLoadingCurrentProduct, currentProduct, error } = useSelector(
    (store) => store.products,
  );
  const { nome, imagem, categorias, descricao, preco, link, categoria } =
    currentProduct;
  const price =
    Number.isFinite(+quantity) && +quantity > 0
      ? Number((+quantity * preco).toFixed(2))
      : 0;

  const clickabel = +quantity > 0 && price > 0;

  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { cartProducts } = useSelector((store) => store.cart);

  const isInCart = cartProducts?.some?.(
    (productItem) => productItem.nome === nome,
  );
  function handleChangeInput(ev) {
    const value = ev.target.value;

    if (value.startsWith("-")) return;

    if (categoria === "Un") {
      setQuantity(`${Math.trunc(+value)}`);
    } else {
      if (/^\d*\.?\d*$/.test(value)) {
        setQuantity(value);
      }
    }
  }
  async function handleAdd(ev) {
    ev.preventDefault();
    if (price <= 0 || quantity <= 0) return;
    await dispatch(
      addProductCart(
        {
          nome,
          imagem,
          categorias,
          descricao,
          total: Number((preco * quantity).toFixed(2)),
          id,
          quantity,
          categoria,
        },
        isInCart,
      ),
    ).unwrap()
    navigate("/cart");
  }
  if (error) return <Error message={error} />;

  if (isLoadingCurrentProduct)
    return <Spinner message="Carregando Produto..." />;

  return (
    <div className={styles.product}>
      <div className={styles.imgContainer}>
        <img alt={nome} src={imagem} className={styles.img} />
      </div>
      <div className={styles.informations}>
        <div className={styles.importantInformations}>
          <h1 className={styles.name}>{nome}</h1>
          <p className={styles.description}>{descricao}</p>
        </div>
        <div className={styles.details}>
          <p className={styles.category}>
            Categorias:{" "}
            {categorias?.map((categoria, index) => (
              <strong key={categoria}>
                {index === categorias.length - 1
                  ? `${categoria}.`
                  : `${categoria},`}
              </strong>
            ))}
          </p>
          <p className={styles.seePlus}>
            Conheça mais clicando{" "}
            <a href={link}>
              <strong>aqui</strong>
            </a>
          </p>
          <div
            className={styles.priceContainer}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <span className={styles.labelInput}>Digite uma quantidade:</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="digite uma quantidade"
              className={styles.productInput}
              value={quantity}
              onChange={handleChangeInput}
            />
            <p className={styles.price}>
              Total:<strong>{isNaN(price) ? "Inválido" : price}</strong> R$
            </p>
          </div>
        </div>
        <Button disabled={!clickabel} onClick={handleAdd}>
          {isInCart ? "Editar no Carrinho" : "Adicionar ao carrinho"}
        </Button>
      </div>
    </div>
  );
}

export default Product;

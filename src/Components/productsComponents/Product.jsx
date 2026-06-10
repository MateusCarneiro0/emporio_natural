import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getProduct } from "../features/productsSlice";

import { ThreeDots } from "react-loader-spinner";
import Error from "../Error";
import Button from "../Button";

import styles from "./Product.module.css";
import { addProductCart } from "../features/cartSlice";

function Product() {
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { id } = useParams();

  const { isLoading, currentProduct, error } = useSelector(
    (store) => store.products,
  );
  const { nome, imagem, categorias, descricao, preco, link } = currentProduct;
  useEffect(() => {
    dispatch(getProduct(id));
  }, [id, dispatch]);

  if (isLoading) return <ThreeDots />;

  if (error) return <Error />;

  return (
    <div className={styles.product}>
      <div className={styles.imgContainer}>
        <img alt={nome} src={imagem} />
      </div>
      <div className={styles.informations}>
        <h1>{nome}</h1>
        <p className={styles.description}>{descricao}</p>
        <p className={styles.categoryContainer}>
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
          <input
            type="number"
            placeholder="digite uma quantidade"
            className={styles.productInput}
            value={quantity}
            onChange={(ev) => {
              setQuantity((quantity) =>
                +ev.target.value < 0 ? quantity : +ev.target.value,
              );
            }}
          />
          <p className={styles.price}>
            Total:{Math.round(preco * quantity)} R$
          </p>
        </div>
        <Button
          onClick={() => {
            dispatch(
              addProductCart({
                nome,
                imagem,
                categorias,
                descricao,
                total: Math.round(preco * quantity),
                id,
                quantity,
              }),
            );
            navigate("/cart");
          }}
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  );
}

export default Product;

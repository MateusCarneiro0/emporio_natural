import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getProduct } from "../../api/productsApi";

import Error from "../Error";
import Button from "../Button";

import styles from "./Product.module.css";
import { addProductCart } from "../../api/cartApi";
import Spinner from "../Spinner";

function Product() {
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getProduct(id));
  }, [id, dispatch]);

  const { cartProducts, error: cartError } = useSelector((store) => store.cart);

  const { isLoading, currentProduct, error } = useSelector(
    (store) => store.products,
  );
  const { nome, imagem, categorias, descricao, preco, link, categoria } =
    currentProduct;

  if (isLoading) return <Spinner message="Carregando Produto..." />;

  if (error) return <Error message={error} />;

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
              type="number"
              inputMode="numeric"
              placeholder="digite uma quantidade"
              className={styles.productInput}
              value={quantity}
              onChange={(ev) => {
                setQuantity((quantity) => {
                  const value =
                    +ev.target.value <= 0 ? quantity : +ev.target.value;
                  return categoria === "Un" ? Math.round(value) : value;
                });
              }}
            />
            <p className={styles.price}>
              Total:<strong>{Number((preco * quantity).toFixed(2))}</strong> R$
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            dispatch(
              addProductCart({
                nome,
                imagem,
                categorias,
                descricao,
                total: Number((preco * quantity).toFixed(2)),
                id,
                quantity,
                categoria,
              }),
            );
            if (!cartError && !isLoading) {
              navigate("/cart");
            }
          }}
        >
          {cartProducts?.some?.((productItem) => productItem.nome === nome)
            ? "Editar no Carrinho"
            : "Adicionar ao carrinho"}
        </Button>
      </div>
    </div>
  );
}

export default Product;

import { useParams } from "react-router-dom";
import { useState } from "react";
import { getProduct } from "../features/productsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import Error from "../Error";
import styles from "./Product.module.css";
import Button from "../Button";
function Product() {
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();

  const { id } = useParams();

  const { isLoading, currentProduct, error } = useSelector(
    (store) => store.products,
  );
  const { nome, imagem, categorias, descricao,preco } = currentProduct;
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
            value={quantity || 1}
            onChange={(ev) => {
              setQuantity((quantity) =>
                +ev.target.value < 0 ? quantity : +ev.target.value,
              );
            }}
          />
          <p className={styles.price}>Total:{preco * quantity} R$</p>
        </div>
        <Button>Adicionar ao carrinho</Button>
      </div>
    </div>
  );
}

export default Product;

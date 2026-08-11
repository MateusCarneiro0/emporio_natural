import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { getProduct } from "../../api/productsApi";

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

  const clickabel = quantity > 0 && price > 0;

  const { id } = useParams();

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const { cartProducts } = useSelector((store) => store.cart);
  useEffect(() => {
    dispatch(getProduct(id));
  }, [id, dispatch]);


  function handleChangeInput(ev) {
    if(categoria === "Un"){
      setQuantity(`${Math.trunc(+ev.target.value)}`)
    }else{

      setQuantity(ev.target.value);
    }
  }
  function handleAdd(ev) {
    ev.preventDefault();
    if (price <= 0 || quantity <= 0) return;
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
    navigate("/cart")
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
              Total:<strong>{isNaN(price) ? "Inválido":price}</strong> R$
            </p>
          </div>
        </div>
        <Button
          disabled={!clickabel}
          onClick={handleAdd}
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

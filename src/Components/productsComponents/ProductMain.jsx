import { useEffect } from "react";
import { fetchProducts } from "../features/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { memo } from "react";
import CardProduct from "./CardProduct";
import styles from "./ProductMain.module.css";
import { ThreeDots } from "react-loader-spinner";
const ProductMain = memo(function ProductMain() {
  const dispatch = useDispatch();
  const frase = [
    "o que falta para o seu dia ficar mais saudável?🌞",
    "Vamos comprar aquele Whey para começar o dia?🔋",
    "Deixa eu adivinhar, que tal comprar uma castanha de caju?",
  ].at(Math.floor(Math.random() * 3));

  const { isLoading, displayProducts, error } = useSelector(
    (store) => store.products,
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (isLoading) return <ThreeDots wrapperClass={styles.spinner} />;
  if (error)
    return (
      <h3
        style={{
          fontSize: "60px",
          justifySelf: "center",
          alignSelf: "center",
          color: "red",
          marginTop:"150px"
        }}
      >
        A error ocurred in fetch data try again later
      </h3>
    );
  return (
    <main className={styles.products}>
      <header>
        <h2>
          Olá <i>%NAME%</i>,{frase}
        </h2>
      </header>
      <div className={styles.productsContainer}>
        {displayProducts.map((product) => (
          <CardProduct
            key={product.id}
            title={product.nome}
            src={product.imagem}
            price={25}
          >
            {product.descricao}
          </CardProduct>
        ))}
      </div>
    </main>
  );
});

export default ProductMain;

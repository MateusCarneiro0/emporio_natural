import { useEffect, useState } from "react";
import { fetchProducts,searchProducts } from "../features/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { memo } from "react";
import CardProduct from "./CardProduct";
import styles from "./ProductMain.module.css";
import { ThreeDots } from "react-loader-spinner";
import Error from "../Error";
import { Outlet, useParams } from "react-router-dom";
const ProductMain = memo(function ProductMain() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const { authUser } = useSelector((store) => store.auth);
  const { isLoading: isLoadingCart } = useSelector((store) => store.cart);
  const frase = [
    "o que falta para o seu dia ficar mais saudável?🌞",
    "Vamos comprar aquele Whey para começar o dia?🔋",
    "Deixa eu adivinhar, que tal comprar uma castanha de caju?",
  ].at(Math.floor(Math.random() * 3));

  const { isLoading, displayProducts, error } = useSelector(
    (store) => store.products,
  );
  useEffect(() => {
    dispatch(searchProducts(query))
  },[dispatch,query])
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (id) return <Outlet />;

  if (isLoading || isLoadingCart)
    return <ThreeDots wrapperClass={styles.spinner} />;
  if (error) return <Error />;

  return (
    <main className={styles.products}>
      <header>
        <h2>
          Olá <i>{authUser}</i>,{frase}
        </h2>
        <input
        className={styles.searchInput}
          style={{ width: "98%",height:"100px" }}
          placeholder="Digite um produto..."
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
        />
      </header>
      <div className={styles.productsContainer}>
        {displayProducts.map((product) => (
          <CardProduct
            key={product.id}
            title={product.nome}
            src={product.imagem}
            price={product.preco}
            id={product.id}
            categoria={product.categoria}
          >
            {product.descricao}
          </CardProduct>
        ))}
        {displayProducts.length === 0 && <h3>Nenhum produto</h3>}
      </div>
    </main>
  );
});

export default ProductMain;

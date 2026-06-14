import { useEffect, useRef, useState } from "react";
import { searchProducts } from "../features/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { memo } from "react";
import CardProduct from "./CardProduct";
import styles from "./ProductMain.module.css";
import Error from "../Error";
import { Outlet, useParams } from "react-router-dom";
import Spinner from "../Spinner";
const ProductMain = memo(function ProductMain() {
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();

  const { id } = useParams();

  const { authUser } = useSelector((store) => store.auth);
  const { isLoading: isLoadingCart } = useSelector((store) => store.cart);

  const phraseRef = useRef(null);

  useEffect(() => {
    phraseRef.current = [
      "o que falta para o seu dia ficar mais saudável? 🌞",
      "Vamos comprar aquele Whey para começar o dia? 🔋",
      "Deixa eu adivinhar, que tal comprar uma castanha de caju? 🥜",
      "A noite e o dia,mas a energia vem de uma frutinha 🍎"
    ].at(Math.floor(Math.random() * 3));
  }, []);

  const { isLoading, displayProducts, error } = useSelector(
    (store) => store.products,
  );
  useEffect(() => {
    dispatch(searchProducts(query));
  }, [dispatch, query]);

  if (id) return <Outlet />;

  if (isLoading || isLoadingCart) return <Spinner />;
  if (error) return <Error />;

  return (
    <main className={styles.products}>
      <header>
        <h2>
          Olá <i>{authUser}</i>,{phraseRef.current}
        </h2>
        <input
          className={styles.searchInput}
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
        {displayProducts.length === 0 && (
          <h1 className={styles.enough}>Nenhum produto</h1>
        )}
      </div>
    </main>
  );
});

export default ProductMain;

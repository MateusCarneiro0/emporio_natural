import { useEffect, useRef, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";

import { searchProducts } from "../../slices/productsSlice";

import Error from "../Error";
import Spinner from "../Spinner";
import CardProduct from "./CardProduct";

import styles from "./ProductMain.module.css";

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
      "A noite e o dia,mas a energia vem de uma frutinha 🍎",
    ].at(Math.floor(Math.random() * 4));
  }, []);

  const { isLoading, displayProducts, error } = useSelector(
    (store) => store.products,
  );
  useEffect(() => {
    dispatch(searchProducts(query));
  }, [dispatch, query]);

  if (id) return <Outlet />;

  if (isLoading || isLoadingCart)
    return <Spinner message="Carregando Produtos..." />;
  if (error) return <Error />;

  return (
    <main className={styles.products}>
      <header>
        {authUser && (
          <h2>
            Olá <i>{authUser}</i>,{phraseRef.current}
          </h2>
        )}
        <input
          className={styles.searchInput}
          placeholder="Digite um produto..."
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
        />
        {displayProducts.length && (
          <h3 className={styles.lengthDisplay}>
            Foram encontrados <i>{displayProducts.length}</i> produtos
          </h3>
        )}
      </header>
      <div className={styles.productsContainer}>
        {displayProducts.length ? (
          displayProducts.map((product) => (
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
          ))
        ) : (
          <h1 className={styles.enough}>Nenhum produto</h1>
        )}
      </div>
    </main>
  );
});

export default ProductMain;

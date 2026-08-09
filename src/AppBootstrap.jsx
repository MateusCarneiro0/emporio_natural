import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getLocalStorage from "./api/localStorageThunk";
import { fetchProducts } from "./api/productsApi";
import SpinnerFullScreen from "./Components/SpinnerFullScreen";
import { BASE_URL } from "./secretKeys";
import Error from "./Components/Error";
function AppBootstrap({ children }) {
  const { isAuthenticated, isLoadingGetStorage } = useSelector(
    (store) => store.auth,
  );
  const { isExistingURL } = useSelector((state) => state.apiErrors);
  const { products } = useSelector((store) => store.products);
  const [isCorrectUrl, setIsCorrectUrl] = useState(true);
  useEffect(() => {
    if (!URL.canParse(BASE_URL) && isCorrectUrl) {
      setIsCorrectUrl(false);
      throw new Error("Erro em buscar dados no servidor");
    }
  }, [isCorrectUrl]);
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  useEffect(() => {
    if (products.length === 0 && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchProducts());
    }
  }, [products, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getLocalStorage());
    }
  }, [dispatch, isAuthenticated]);

  if (isLoadingGetStorage)
    return <SpinnerFullScreen message="Carregando dados..." />;
  if(!isExistingURL) return <Error message="URL não válida acesse em outro momento" />
  return children;
}

export default AppBootstrap;

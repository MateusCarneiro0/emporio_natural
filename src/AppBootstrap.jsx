import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import getLocalStorage from "./api/localStorageThunk";
import { fetchProducts } from "./api/productsApi";
import SpinnerFullScreen from "./Components/SpinnerFullScreen";
function AppBootstrap({ children }) {
  const { isAuthenticated, isLoadingGetStorage } = useSelector(
    (store) => store.auth,
  );
  const { products } = useSelector((store) => store.products);

  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  useEffect(() => {
    if (products.length === 0 && !hasFetched.current) {
      hasFetched.current = true
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

  return children;
}

export default AppBootstrap;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import getLocalStorage from "./api/localStorageThunk";
import { fetchProducts } from "./api/productsApi";

function AppBootstrap({ children }) {
  const { isAuthenticated } = useSelector((store) => store.auth);
  const { products } = useSelector((store) => store.products);
  const dispatch = useDispatch();
  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [products, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getLocalStorage());
    }
  }, [dispatch]);

  return children;
}

export default AppBootstrap;

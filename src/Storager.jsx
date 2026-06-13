import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import getLocalStorage from "./Components/features/localStorageThunk";
import { fetchCart } from "./Components/features/cartSlice";
import {receiveProducts} from "./Components/features/productSlice"
function Storager({ children }) {
  const { isAuthenticated, authUserId: userId } = useSelector(
    (store) => store.auth,
  );
  const {products} = useSelector(store => store.products)
  const dispatch = useDispatch();
  useEffect(() => {
    if(products.length !== 0) dispatch(receiveProducts())
  },[products])

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getLocalStorage())
    };
  }, [dispatch, isAuthenticated]);
  useEffect(() => {
    if(userId) dispatch(fetchCart(userId));
  }, [dispatch,userId]);
  return children;
}

export default Storager;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import getLocalStorage from "./Components/features/localStorageThunk";
import { fetchCart } from "./Components/features/cartSlice";

function Storager({ children }) {
  const { isAuthenticated, authUserId: userId } = useSelector(
    (store) => store.auth,
  );
  const dispatch = useDispatch();

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

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getLocalStorage from "./api/localStorageThunk";
import SpinnerFullScreen from "./Components/SpinnerFullScreen";
import { BASE_URL } from "./secretKeys";
import Error from "./Components/Error";

function AppBootstrap({ children }) {
  const { isAuthenticated, isLoadingGetStorage } = useSelector(
    (store) => store.auth,
  );
  const [isCorrectUrl, setIsCorrectUrl] = useState(true);

  const dispatch = useDispatch();
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    if (!URL.canParse(BASE_URL) && isCorrectUrl) {
      setIsCorrectUrl(false);
      throw new Error("Erro em buscar dados no servidor");
    }
  }, [isCorrectUrl]);
  
  useEffect(() => {
    if (!isAuthenticated && !hasFetchedUser.current) {
      dispatch(getLocalStorage());
      hasFetchedUser.current = true;
    }
  }, [dispatch, isAuthenticated]);
  
  
  if (isLoadingGetStorage)
    return <SpinnerFullScreen message="Carregando dados..." />;
  return children;
}

export default AppBootstrap;

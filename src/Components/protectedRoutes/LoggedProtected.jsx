import { useSelector } from "react-redux";
import { Navigate } from "react-router";
function LoggedProtected({ children }) {
  const { isAuthenticated } = useSelector((store) => store.auth);

  return !isAuthenticated ? children : <Navigate replace to="/produtos" />;
}

export default LoggedProtected;

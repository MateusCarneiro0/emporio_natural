import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AuthProtected({ children }) {
  const { isAuthenticated } = useSelector((store) => store.auth);

  return isAuthenticated ? children:<Navigate replace to="/login" /> ;
}

export default AuthProtected;

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import styles from "./Error.module.css";
import Footer from "./footerComponents/Footer";
import NavBar from "./NavBarComponents/NavBar";
import { clearErrors } from "../slices/authSlice";

function Error({ message }) {
  const dispatch = useDispatch() 
  const navigate = useNavigate()
  const handleReturn = () => {
    navigate("/")
    dispatch(clearErrors())
  };
  return (
    <>
      <NavBar />
      <div className={styles.errorContainer}>
        <h2 className={styles.message}>Ocorreu um erro 😭</h2>
        <h3 className={styles.errorMessage}>
          {message ? message : "Um erro ocorreu tente denovo"}
        </h3>
        <button
          aria-label="Voltar ao início e recarregar página"
          onClick={handleReturn}
          className={styles.button}
        >
          Voltar ao início
        </button>
      </div>
      <Footer />
    </>
  );
}

export default Error;

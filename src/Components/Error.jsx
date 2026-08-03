import { useNavigate } from "react-router-dom";
import styles from "./Error.module.css";
import Footer from "./footerComponents/Footer";
import NavBar from "./NavBarComponents/NavBar";

function Error({ message }) {
  const navigate = useNavigate()
  const handleReturn = () => {
    navigate("/")
    window.location.reload();
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
          Voltar ao início e recarregar página
        </button>
      </div>
      <Footer />
    </>
  );
}

export default Error;

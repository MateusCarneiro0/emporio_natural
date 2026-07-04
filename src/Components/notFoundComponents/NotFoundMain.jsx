import styles from "./NotFoundMain.module.css";
import {useNavigate} from "react-router-dom"
function NotFound() {
  const navigate = useNavigate()
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.code}>404</h1>
      <h3 className={styles.message}>
        A rota especificada não existe, tente outra rota.
      </h3>
      <button className={styles.button} onClick={() => navigate("/")}>Voltar ao início</button>
    </div>
  );
}

export default NotFound;

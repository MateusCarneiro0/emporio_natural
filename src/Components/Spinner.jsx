import { ThreeDots } from "react-loader-spinner";
import styles from "./Spinner.module.css";
function Spinner({ message, type = "lg" }) {
  return (
    <div className={`${styles.spinnerContainer} ${styles[type]}`}>
      <div className={styles.spinner}>
        <ThreeDots />
        <h2>{message ?? "Carregando dados..."}</h2>
      </div>
    </div>
  );
}

export default Spinner;

import { ThreeDots } from "react-loader-spinner";
import styles from "./Spinner.module.css";
function Spinner({ message }) {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <ThreeDots />
        <h2>{message ? message : "Carregando dados"}</h2>
      </div>
    </div>
  );
}

export default Spinner;

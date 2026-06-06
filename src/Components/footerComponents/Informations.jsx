import { NUMBER_PHONE } from "../../NumberPhone";
import styles from "./Informations.module.css";

function Informations() {
  const date = new Date().getFullYear();
  return (
    <div className={styles.informations}>
      <strong>&copy; Empório Natural {date}</strong>
      <p>Endereço:Rua principal</p>
      <p>Telefone:{NUMBER_PHONE}</p>
    </div>
  );
}

export default Informations;

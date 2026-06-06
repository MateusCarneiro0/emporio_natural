import { NUMBER_PHONE } from "../../NumberPhone";
import styles from "./Links.module.css";
function Links() {
  return (
    <div className={styles.links}>
      <a href="https://www.instagram.com/emporionatural.22">Instagram</a>
      <a href={`https://wa.me/${NUMBER_PHONE}`}>Whatsapp</a>
      <a href="mailto:emporionatural36@gmail.com">Email</a>
    </div>
  );
}

export default Links;

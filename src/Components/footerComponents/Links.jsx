import {NUMBER_PHONE} from "../../base_url"
import styles from "./Links.module.css";
function Links() {
  return (
    <div className={styles.links}>
      <a href="https://www.instagram.com/emporionatural.22">Instagram</a>
      <a href={`https://wa.me/${NUMBER_PHONE}/?text=Olá%20quero%20tirar%20uma%20dúvida.`}>Whatsapp</a>
      <a href="mailto:emporionatural36@gmail.com">Email</a>
    </div>
  );
}

export default Links;

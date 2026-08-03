import { NUMBER_PHONE } from "../../secretKeys";
import styles from "./Links.module.css";
function Links() {
  return (
    <div className={styles.links}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.instagram.com/emporionatural.22"
      >
        Instagram
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://wa.me/${NUMBER_PHONE}/?text=Olá%20quero%20tirar%20uma%20dúvida.`}
      >
        Whatsapp
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="mailto:emporionatural36@gmail.com"
      >
        Email
      </a>
    </div>
  );
}

export default Links;

import styles from "./Footer.module.css";
import Informations from "./Informations";
import Links from "./Links";

function Footer() {
  return (
    <footer className={styles.footer}>
      <Informations />
      <Links />
    </footer>
  );
}

export default Footer;

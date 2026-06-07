import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./NavBar.module.css";
function NavBar() {
  return (
    <nav className={styles.nav}>
      <NavLink className={styles.textLink} to="/">
        <Logo />
      </NavLink>
      <NavLink to="/produtos" className={styles.textLink}>
        Produtos
      </NavLink>
      <NavLink to="/contato" className={styles.textLink}>
        Contato
      </NavLink>
    </nav>
  );
}

export default NavBar;

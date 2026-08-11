import { NavLink } from "react-router";
import styles from "./NavLoginButton.module.css";
function NavLoginButton() {
  return (
    <NavLink tabIndex={0} aria-label="Ir para login" className={styles.link} to="/login">
      <p className={styles.button}>Login</p>
    </NavLink>
  );
}

export default NavLoginButton;

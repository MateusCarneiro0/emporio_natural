import { NavLink } from "react-router-dom";
import styles from "./NavLoginButton.module.css";
function NavLoginButton() {
  return (
    <NavLink className={styles.link} to="/login">
      <p className={styles.button}>Login</p>
    </NavLink>
  );
}

export default NavLoginButton;

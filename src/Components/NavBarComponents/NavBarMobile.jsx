import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./NavBarMobile.module.css";
import NavModal from "./NavModal";

function NavBarMobile() {
  return (
    <nav className={styles.nav}>
      <NavModal />
      <div>
        <NavLink className={styles.textLink} to="/">
          <Logo />
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBarMobile;

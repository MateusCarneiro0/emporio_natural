import { NavLink, useNavigate, useParams } from "react-router-dom";
import Logo from "./Logo";
import styles from "./NavBar.module.css";
import IconButton from "@mui/material/IconButton";
import WestIcon from "@mui/icons-material/West";
import { useSelector } from "react-redux";
import LogoutIconNav from "./LogoutIconNav";
import NavModal from "./NavModal";

function NavBarMobile() {
  const { isAuthenticated } = useSelector((store) => store.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      {id ? (
        <NavLink>
          <IconButton onClick={() => navigate(-1)}>
            <WestIcon />
          </IconButton>
        </NavLink>
      ) : (
        isAuthenticated && <LogoutIconNav />
      )}
      <NavLink className={styles.textLink} to="/">
        <Logo />
      </NavLink>
      <NavModal />
    </nav>
  );
}

export default NavBarMobile;

import { NavLink, useNavigate, useParams } from "react-router-dom";
import styles from "./NavBarMobile.module.css";
import NavModal from "./NavModal";
import { IconButton } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
function NavBarMobile() {
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
        <NavModal />
      )}
    </nav>
  );
}

export default NavBarMobile;

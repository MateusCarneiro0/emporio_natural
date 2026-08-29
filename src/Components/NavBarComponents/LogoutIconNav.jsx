import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutApi } from "../../api/authApi";
import { useDispatch } from "react-redux";
import styles from "./LogoutIconNav.module.css";
function LogoutIconNav() {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(logoutApi());
  };

  return (
    <IconButton onClick={handleClick}>
      <LogoutIcon sx={{ color: "rgb(255, 42, 42)" }} />{" "}
      <span className={styles.leaveText}>Sair</span>
    </IconButton>
  );
}

export default LogoutIconNav;

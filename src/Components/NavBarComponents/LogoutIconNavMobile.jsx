import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";
import { logout } from "../../api/authApi";
import { useDispatch } from "react-redux";
import styles from "./LogoutIconNavMobile.module.css";
function LogoutIconNavMobile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className={styles.button} aria-label="Sair da conta">
      <IconButton
        onClick={async () => {
          await dispatch(logout());
          navigate("/");
        }}
      >
        <LogoutIcon sx={{ color: "rgb(255, 42, 42)" }} />{" "}
        <span className={styles.leaveText}>Sair</span>
      </IconButton>
    </div>
  );
}

export default LogoutIconNavMobile;

import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { useDispatch } from "react-redux";
function LogoutIconNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <IconButton
      onClick={() => {
        navigate("/");
        dispatch(logout());
      }}
    >
      <LogoutIcon /> <span>Sair</span>
    </IconButton>
  );
}

export default LogoutIconNav;

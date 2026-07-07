import { NavLink, useNavigate } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";
import { IconButton } from "@mui/material";
import { leaveOfCurrentProduct } from "../../slices/productsSlice";
import { useDispatch } from "react-redux";
function LeaveProductIcon() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleClick() {
    navigate(-1);
    dispatch(leaveOfCurrentProduct());
  }
  return (
    <NavLink>
      <IconButton onClick={handleClick}>
        <WestIcon />
      </IconButton>
    </NavLink>
  );
}

export default LeaveProductIcon;

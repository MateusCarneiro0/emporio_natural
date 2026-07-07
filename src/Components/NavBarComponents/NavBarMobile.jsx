import { useParams } from "react-router-dom";
import styles from "./NavBarMobile.module.css";
import NavModal from "./NavModal";
import LeaveProductIcon from "./LeaveProductIcon";
function NavBarMobile() {
  const { id } = useParams();

  return (
    <nav className={styles.nav}>
      {id ? (
        <LeaveProductIcon />
      ) : (
        <NavModal />
      )}
    </nav>
  );
}

export default NavBarMobile;

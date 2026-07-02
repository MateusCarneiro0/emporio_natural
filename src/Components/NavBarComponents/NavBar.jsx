import NavBarMobile from "./NavBarMobile";
import NavBarDesktop from "./NavBarDesktop";

function NavBar() {
  return <>{window.innerWidth <= 720 ? <NavBarMobile /> : <NavBarDesktop />}</>;
}

export default NavBar;

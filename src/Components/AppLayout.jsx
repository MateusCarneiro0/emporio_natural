import { Outlet } from "react-router-dom";
import NavBar from "./NavBarComponents/NavBar";
import Footer from "./footerComponents/Footer";

function AppLayout() {
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;

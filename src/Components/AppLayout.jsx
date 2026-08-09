import { Outlet, useNavigation } from "react-router";
import NavBar from "./NavBarComponents/NavBar";
import Footer from "./footerComponents/Footer";
import Spinner from "./Spinner";

function AppLayout() {
  const navigation = useNavigation();
  const isLoadingData = navigation.state === "loading";
  return (
    <div>
      <NavBar />
      {isLoadingData ? <Spinner /> : <Outlet />}
      <Footer />
    </div>
  );
}

export default AppLayout;

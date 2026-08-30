import { Outlet, useLocation } from "react-router";
import NavBar from "./NavBarComponents/NavBar";
import Footer from "./footerComponents/Footer";
import { useEffect } from "react";
import { closeModal } from "../slices/globalSlice";
import { useDispatch } from "react-redux";

function AppLayout() {
  const dispatch = useDispatch()
  const location = useLocation();
  useEffect(() => {
    dispatch(closeModal());
  }, [location.pathname,dispatch]);
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;

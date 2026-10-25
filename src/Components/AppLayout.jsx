import { Outlet, useLocation } from "react-router";
import NavBar from "./NavBarComponents/NavBar";
import Footer from "./footerComponents/Footer";
import { useEffect } from "react";
import { closeModal, toastSelector } from "../slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "./Toast";

function AppLayout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const toasts = useSelector(toastSelector);
  useEffect(() => {
    dispatch(closeModal());
  }, [location.pathname, dispatch]);
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />

      {toasts.map((toast) => (
        <Toast text={toast.text} key={toast.name} error={!toast.isSuccess} />
      ))}
    </div>
  );
}

export default AppLayout;

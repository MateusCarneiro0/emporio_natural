import Footer from "./footerComponents/Footer";
import NavBar from "./NavBarComponents/NavBar";
import Spinner from "./Spinner";

function SpinnerFullScreen({ message }) {
  return (
    <>
      <NavBar />
      <Spinner message={message} />
      <div style={{ marginBottom: "350px" }}></div>
      <Footer />
    </>
  );
}

export default SpinnerFullScreen;

import Footer from "../Components/footerComponents/Footer";
import NavBar from "../Components/NavBarComponents/NavBar";

function NotFound() {
  return (
    <>
      <NavBar />
      <div
        style={{
          color: "red",
          fontSize: "70px",
          marginBottom: "500px",
          fontFamily: "Inter",
        }}
      >
        404 Not Found :(
      </div>
      <Footer />;
    </>
  );
}

export default NotFound;

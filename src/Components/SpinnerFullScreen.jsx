
import Spinner from "./Spinner";

function SpinnerFullScreen({ message }) {
  return (
    <>
      <Spinner message={message} />
      <div style={{ marginBottom: "350px" }}></div>
    </>
  );
}

export default SpinnerFullScreen;


import Spinner from "./Spinner";
import styles from './SpinnerFullScreen.module.css'
function SpinnerFullScreen({ message }) {
  return (
    <div className={styles.container}>
      <Spinner message={message} />
    </div>
  );
}

export default SpinnerFullScreen;

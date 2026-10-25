import styles from "./Toast.module.css";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { createPortal } from "react-dom";
function Toast({ error, text, close }) {
  return createPortal(
    <div
      className={`${styles.container} ${error ? styles.wrong : styles.correct}`}
    >
      <div className={styles.toast}>
        {error ? (
          <CancelOutlinedIcon
            sx={{ fill: "red", width: "25px", height: "25px" }}
          />
        ) : (
          <CheckCircleOutlineRoundedIcon
            sx={{ fill: "greenyellow", width: "25px", height: "25px" }}
          />
        )}
        <p className={styles.message}>{text}</p>
      </div>
      <button className={styles.deleteButton} onClick={close}>&times;</button>
    </div>,
    document.body,
  );
}

export default Toast;

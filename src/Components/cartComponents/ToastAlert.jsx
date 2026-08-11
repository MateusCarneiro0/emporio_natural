import styles from "./ToastAlert.module.css";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
function ToastAlert({
  error = true,
  text = "A operação de adicionar produto Banana Prata foi bem-sucedida",
}) {
  return (
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
    </div>
  );
}

export default ToastAlert;

import styles from "./Logo.module.css"

function Logo() {
  return (
    <div className={styles.logo}>
      <img alt="logo" src="/images/image_logo.png" />  
      <h2>Empório Natural</h2>
    </div>
  );
}

export default Logo;

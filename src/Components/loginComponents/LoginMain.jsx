import { useEffect, useState } from "react";
import { receiveUsers } from "../features/authSlice";
import { useDispatch } from "react-redux";
import Input from "./Input";
import styles from "./LoginMain.module.css";
import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
function LoginMain() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(receiveUsers());
  }, [dispatch]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const clickabel = username && password
  return (
    <div className={styles.loginContainer}>
      <form className={styles.login}>
        <h1 style={{ color: "#f7f4e3" }}>Que bom te ver de volta</h1>
        <Input
          placeholder={"Digite seu username"}
          setState={setUsername}
          value={username}
        />
        <Input
          placeholder={"Digite sua senha"}
          setState={setPassword}
          value={password}
        />
        <LoginButton color="white" backgroundColor="rgb(163, 220, 79)">Login</LoginButton>
        <p>
          Não tem uma conta ainda ? Aperte <Link className={styles.link} to="/signup">Aqui</Link> para ter uma conta
        </p>
      </form>
    </div>
  );
}

export default LoginMain;

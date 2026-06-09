import styles from './SignupMain.module.css'
import { useEffect, useState } from "react";
import { receiveUsers } from "../features/authSlice";
import { useDispatch } from "react-redux";
import Input from "./Input";
import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
function SignupMain() {
    const dispatch = useDispatch();
  useEffect(() => {
    dispatch(receiveUsers());
  }, [dispatch]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
        <h1 style={{ color: "#f7f4e3" }}>Vamos se registrar</h1>
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
        <LoginButton color="white" backgroundColor="rgb(94, 133, 231)">Login</LoginButton>
        <p>
          Tem uma conta ? Aperte <Link className={styles.link} to="/login">Aqui</Link> para logar nela
        </p>
      </div>
    </div>
  );
}

export default SignupMain

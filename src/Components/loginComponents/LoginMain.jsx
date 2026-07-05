import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";

import Input from "./Input";
import LoginButton from "./LoginButton";
import Error from "../Error";

import { ThreeDots } from "react-loader-spinner";

import styles from "./LoginMain.module.css";

function LoginMain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, authError, isAuthenticated } = useSelector(
    (store) => store.auth,
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const clickabel = username && password;
  function handleSubmit(ev) {
    ev.preventDefault();
    ev.preventDefault();
    dispatch(loginUser(username, password));
  }

  useEffect(() => {
    if (isAuthenticated) navigate("/produtos");
  }, [isAuthenticated, navigate]);
  if (error) return <Error message={error} />;
  return (
    <div className={styles.loginContainer}>
      <form className={styles.login} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Que bom te ver de volta</h1>
        <Input
          placeholder={"Digite seu username"}
          setState={setUsername}
          value={username}
          disabled={isLoading}
        />
        <Input
          placeholder={"Digite sua senha"}
          setState={setPassword}
          value={password}
          disabled={isLoading}
          type="password"
        />
        {authError && (
          <p className={styles.authError}>Senha ou usuários inválidos</p>
        )}
        {isLoading ? (
          <ThreeDots />
        ) : (
          <LoginButton
            disabled={!clickabel}
            color="white"
            backgroundColor="rgb(163, 220, 79)"
          >
            Login
          </LoginButton>
        )}
        <p className={styles.notHaveLink}>
          Não tem uma conta ainda ? Aperte{" "}
          <Link className={styles.link} to="/signup">
            Aqui
          </Link>{" "}
          para ter uma conta
        </p>
      </form>
    </div>
  );
}

export default LoginMain;

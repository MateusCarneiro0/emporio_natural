import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "./Input";
import styles from "./LoginMain.module.css";
import { Link, useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import { loginUser } from "../features/authSlice";
import Error from "../Error";
import { ThreeDots } from "react-loader-spinner";
function LoginMain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, authError, isAuthenticated } = useSelector(
    (store) => store.auth,
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const clickabel = username && password;
  function handleClick(ev) {
    ev.preventDefault();
    dispatch(loginUser(username, password));
  }

  useEffect(() => {
    if (isAuthenticated) navigate("/produtos");
  }, [isAuthenticated, navigate]);
  if (error) return <Error />;
  return (
    <div className={styles.loginContainer}>
      <form className={styles.login}>
        <h1 style={{ color: "#f7f4e3" }}>Que bom te ver de volta</h1>
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
        />
        {authError && (
          <p className={styles.authError}>Senha ou usuários inválidos</p>
        )}
        {isLoading ? (
          <>
            <ThreeDots />
            <span style={{ color: "white" }}>Carregando...</span>
          </>
        ) : (
          <LoginButton
            onClick={handleClick}
            disabled={!clickabel}
            color="white"
            backgroundColor="rgb(163, 220, 79)"
          >
            Login
          </LoginButton>
        )}
        <p>
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

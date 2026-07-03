import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createNewUser } from "../../api/authApi";

import Input from "./Input";
import LoginButton from "./LoginButton";
import Error from "../Error";

import { ThreeDots } from "react-loader-spinner";
import styles from "./LoginMain.module.css";
function SignupMain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, isLoading, error, signupError } = useSelector(
    (store) => store.auth,
  );
  const clickabel = username && password;

  function handleSignup(ev) {
    ev.preventDefault();
    const newUser = {
      user: username,
      password,
    };
    dispatch(createNewUser(newUser));
  }
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/produtos");
    }
  }, [isAuthenticated, navigate]);
  if (error) return <Error />;
  return (
    <div className={styles.loginContainer}>
      <form className={styles.login} onSubmit={handleSignup}>
        <h1 className={styles.title}>Vamos se registrar</h1>
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
        {signupError && <p className={styles.errorSignup}>{signupError}</p>}
        {isLoading ? (
          <ThreeDots />
        ) : (
          <LoginButton register={true} disabled={!clickabel}>
            Registrar
          </LoginButton>
        )}
        <p className={`${styles.notHaveLink}`}>
          Tem uma conta? Aperte{" "}
          <Link className={styles.link} to="/login">
            Aqui
          </Link>{" "}
          para logar nela
        </p>
      </form>
    </div>
  );
}

export default SignupMain;

import styles from "./SignupMain.module.css";
import { useEffect, useState } from "react";
import { createNewUser } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import Error from "../Error";
import { ThreeDots } from "react-loader-spinner";
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
        <h1 style={{ color: "#f7f4e3" }}>Vamos se registrar</h1>
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
        {signupError && (
          <p className={styles.errorSignup}>{signupError}</p>
        )}
        {isLoading ? (
          <>
            <ThreeDots />
            <span style={{ color: "white" }}>Carregando...</span>{" "}
          </>
        ) : (
          <LoginButton
            color="white"
            backgroundColor="rgb(94, 133, 231)"
            disabled={!clickabel}
          >
            Registrar
          </LoginButton>
        )}
        <p>
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

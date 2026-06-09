import styles from "./SignupMain.module.css";
import { useEffect, useState } from "react";
import { createNewUser, receiveUsers } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import { ThreeDots } from "react-loader-spinner";
import  Error  from "../Error";
function SignupMain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(receiveUsers());
  }, [dispatch]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, isLoading, error } = useSelector(
    (store) => store.auth,
  );

  function handleSignup() {
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
        {isLoading ? (
          <ThreeDots color="black" />
        ) : (
          <LoginButton
            onClick={handleSignup}
            color="white"
            backgroundColor="rgb(94, 133, 231)"
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
      </div>
    </div>
  );
}

export default SignupMain;

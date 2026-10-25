import { useEffect, useState } from "react";
import { Form, Link, useActionData, useNavigate,redirect } from "react-router";
import { useSelector } from "react-redux";
import store from "../../app/store";
import { createNewUser } from "../../api/authApi";

import Input from "./Input";
import LoginButton from "./LoginButton";
import Error from "../Error";

import { ThreeDots } from "react-loader-spinner";
import styles from "./LoginMain.module.css";
function SignupMain() {
  const navigate = useNavigate();
  const actionData = useActionData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, isLoading, error } = useSelector(
    (store) => store.auth,
  );
  const clickabel = username && password;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/produtos");
    }
  }, [isAuthenticated, navigate]);
  if (error?.toLocaleLowerCase() === "failed to fetch")
    return (
      <Error message="Erro ao buscar ou mandar dados no servidor, tente novamente" />
    );
  if (error) return <Error message={error} />;
  return (
    <div className={styles.loginContainer}>
      <Form method="POST" className={styles.login}>
        <h1 className={styles.title}>Vamos se registrar</h1>
        <Input
          placeholder="Digite seu username"
          setState={setUsername}
          value={username}
          disabled={isLoading}
          type="text"
          name="username"
          signup={true}
        />
        <Input
          placeholder="Digite sua senha"
          setState={setPassword}
          value={password}
          disabled={isLoading}
          type="password"
          name="password"
          signup={true}
        />
        {actionData?.error && (
          <p className={styles.authError}>{actionData?.error}</p>
        )}
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
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await store.dispatch(
      createNewUser({
        user: data["register-username"],
        password: data["register-password"],
      }),
    );
    redirect("/produtos");
  } catch (err) {
    return { error: err.message, ok: false };
  }
}

export default SignupMain;

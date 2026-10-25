import { useState } from "react";
import { useSelector } from "react-redux";
import { Form, Link, redirect, useActionData } from "react-router";
import store from "../../app/store";
import { loginUser } from "../../api/authApi";

import Input from "./Input";
import LoginButton from "./LoginButton";
import Error from "../Error";

import { ThreeDots } from "react-loader-spinner";

import styles from "./LoginMain.module.css";

function LoginMain() {
  const actionData = useActionData();
  const { isLoading, error } = useSelector((store) => store.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const clickabel = username && password;

  if (error.toLocaleLowerCase() === "failed to fetch")
    return (
      <Error message="Erro ao buscar ou mandar dados no servidor, tente novamente" />
    );
  if (error) return <Error message={error} />;
  return (
    <div className={styles.loginContainer}>
      <Form className={styles.login} method="POST">
        <h1 className={styles.title}>Que bom te ver de volta</h1>
        <Input
          placeholder={"Digite seu username"}
          setState={setUsername}
          value={username}
          disabled={isLoading}
          type="text"
          name="username"
        />
        <Input
          placeholder={"Digite sua senha"}
          setState={setPassword}
          value={password}
          disabled={isLoading}
          type="password"
          name="password"
        />
        {actionData?.error && <p className={styles.authError}>{actionData?.error}</p>}
        {isLoading ? (
          <ThreeDots />
        ) : (
          <LoginButton disabled={!clickabel}>Login</LoginButton>
        )}
        <p className={styles.notHaveLink}>
          Não tem uma conta ainda ? Aperte{" "}
          <Link className={styles.link} to="/signup">
            Aqui
          </Link>{" "}
          para ter uma conta
        </p>
      </Form>
    </div>
  );
}

//login-username
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await store.dispatch(loginUser(data["login-username"], data["login-password"]));
    redirect("/produtos");
  } catch (err) {
    return { error: err.message, ok: false };
  }
}

export default LoginMain;

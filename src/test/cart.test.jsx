import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import Login from "../Pages/Login";
import userEvent from "@testing-library/user-event";
import store from "../app/store";
import { Provider } from "react-redux";

describe("Testando as importações do carrinho ", () => {
  it("Validando o carregamento de todo o carrinho", async () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const user = userEvent.setup();

    const inputName = screen.getByPlaceholderText(/Digite seu username/i);
    const inputSenha = screen.getByLabelText(/Digite sua senha/i);
    const createButton = screen.getByRole("button");

    await user.type(inputName, "TEST_CART");
    await user.type(inputSenha, "TEST_CART");
    await user.click(createButton);

    const cart = store.getState().cart.cartProducts
    
    expect(cart.length === 1).toBe(true)
  });
});
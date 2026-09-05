//Deve ser definido o nome do usuário nos testes em cada teste
import { expect } from "@playwright/test";

export const session_username = `TEST_CART31144444`;
export const session_username_mobile = `TEST_CART_MOBILE${Math.floor(Math.random()*1000)}`;

export const goToLink = async (page, linkReg, selector, mobile) => {
  const linkRegUse = new RegExp(
    linkReg,
    selector === undefined ? "i" : selector,
  );
  if (mobile) {
    await page.getByRole("button", { name: "Abrir menu de navegação" }).click();
  }
  await page.getByRole("link", { name: linkRegUse }).click();
};

export const loginUser = async (page, password, mobile,username) => {
  await page.goto("/");
  await goToLink(page, "Ir para login", "", mobile);

  await page.locator("#login-username").fill(username || (mobile ? session_username_mobile:session_username));
  await page.locator("#login-password").fill(password || "TEST_CART");

  await page.getByRole("button", { name: "Entrar" }).click();
};

export const addProductInCart = async (page, message, quantity,mobile) => {
  await goToLink(page,"ir para produtos","i",mobile)

  const textRegProduct2 = new RegExp(message, "i");

  await page.getByRole("button", { name: textRegProduct2 }).click();
  await expect(page.getByText(/Digite uma quantidade/i)).toBeVisible();

  await page.getByPlaceholder(/digite uma quantidade/i).fill(String(quantity));
  await page.getByRole("button", { name: /o carrinho/ }).click();
  await page.waitForURL("**/cart");
};

import { test, expect } from "@playwright/test";
import { session_username } from "./constants_e2e";
import { goToLink, loginUser, addProductInCart } from "./constants_e2e";

test.describe.configure({ mode: 'serial' });

test("Inicializa corretamente", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Natural/);
  await expect(page.locator("html")).toContainText(
    /Naturais, frescos e cheios de sabor/,
  );
  await goToLink(page, "ir para produtos", "i");
  await page.waitForURL("**/produtos");

  await expect(page.getByText(/encontrados/)).toBeVisible();
});

test("Cria novo usuário corretamente", async ({ page }) => {
  await page.goto("/");
  await goToLink(page, "Ir para login", "i");

  await expect(page.getByText("Que bom te ver de volta")).toBeVisible();
  await page.getByRole("link", { name: /Aqui/i }).click();

  await page.locator("#register-username").fill(session_username);
  await page.locator("#register-password").fill("TEST_CART");

  await page.getByRole("button", { name: "Registrar" }).click();
  await page.waitForURL("**/produtos");

  await expect(page.getByText(/encontrados/i)).toBeVisible();
});

test("Faz o login corretamente", async ({ page }) => {
  await page.goto("/");
  await goToLink(page, "Ir para login");

  await expect(page.getByText("Que bom te ver de volta")).toBeVisible();

  await page.locator("#login-username").fill("TEST_CART");
  await page.locator("#login-password").fill("TEST_CART");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/produtos");

  await expect(page.getByText(/Encontrado/i)).toBeVisible();
});

test("Acessar e adicionar produtos", async ({ page }) => {
  //! TYPE YOUR PRODUCTS
  const products = [
    "Banana Prata",
    "Maçã Fuji",
    "Melancia",
    "Nozes Mariposa",
    "Semente de Chia",
    "Castanha do Pará",
    "Aveia em Flocos Grossos",
  ];

  const indexProduct = 3
  const textRegProduct = new RegExp(
    `Veja mais sobre ${products.at(indexProduct)}`,
    "i",
  );
  const quantity = Math.floor(Math.random() * 240);

  await loginUser(page);

  await page.getByRole("button", { name: textRegProduct }).click();
  await expect(page.getByText(/Digite uma quantidade/i)).toBeVisible();

  await page.getByPlaceholder(/digite uma quantidade/i).fill(String(quantity));
  await page.getByRole("button", { name: /o carrinho/ }).click();
  await page.waitForURL("**/cart");
  await expect(page.getByText(String(quantity))).toBeVisible();
});

test("Remover produtos", async ({ page }) => {
  const products = [
    "Banana Prata",
    "Maçã Fuji",
    "Melancia",
    "Nozes Mariposa",
    "Semente de Chia",
    "Castanha do Pará",
    "Aveia em Flocos Grossos",
  ];

  const indexProduct = Math.floor(Math.random() * products.length);
  const textRegProductDelete = new RegExp(
    `Apagar ${products.at(indexProduct)} do carrinho`,
    "i",
  );
  const textRegProduct = new RegExp(
    `Veja mais sobre ${products.at(indexProduct)}`,
    "i",
  );

  await loginUser(page);
  await addProductInCart(page, textRegProduct, 35);

  await expect(
    page.getByText(/você não colocou nada no carrinho/g),
  ).not.toBeAttached();

  await page.getByRole("button", { name: textRegProductDelete }).click();

  await expect(page.getByText(products.at(indexProduct))).not.toBeAttached();
});

test("Pagar carrinho", async ({ page }) => {
  //! TYPE YOUR PRODUCTS
  const products = [
    "Banana Prata",
    "Maçã Fuji",
    "Melancia",
    "Nozes Mariposa",
    "Semente de Chia",
    "Castanha do Pará",
    "Aveia em Flocos Grossos",
  ];

  const indexProduct = 3
  const textRegProduct = new RegExp(
    `Veja mais sobre ${products.at(indexProduct)}`,
    "i",
  );
  const quantity = Math.floor(Math.random() * 240);

  await loginUser(page);

  await addProductInCart(page, textRegProduct, quantity);

  await expect(page.getByText(String(quantity))).toBeVisible();

  const textRegProduct2 = new RegExp(
    `Veja mais sobre ${products.at(indexProduct ? indexProduct - 1 : indexProduct + 1)}`,
    "i",
  );

  await addProductInCart(page, textRegProduct2, quantity);

  await page.getByRole("button", { name: "Pagar o carrinho" }).click();
  await page.waitForURL("**/cart");
  await expect(
    page.getByText(
      /^Hey 👋,você não colocou nada no carrinho\. Vamos adicionar algum produto\?$/,
    ),
  ).toBeVisible();
});

test("Se usuário existir ver se há algum erro", async ({ page }) => {
  await page.goto("/");
  await goToLink(page, "Ir para login");

  await expect(page.getByText("Que bom te ver de volta")).toBeVisible();
  await page.getByRole("link", { name: /Aqui/i }).click();

  await page.locator("#register-username").fill(session_username);
  await page.locator("#register-password").fill("TEST_CART");

  await page.getByRole("button", { name: "Registrar" }).click();
  await expect(page.getByText("Nome de usuário já criado")).toBeVisible();
});

test("Se login ter credenciais erradas", async ({ page }) => {
  await loginUser(page, "ERROR ERROR ERROR");
  await expect(
    page.getByText("Usuário ou senha não existem tente de novo"),
  ).toBeVisible();
});

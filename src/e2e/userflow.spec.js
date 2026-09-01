/**
 npx playwright test
    Runs the end-to-end tests.

  npx playwright test --ui
    Starts the interactive UI mode.

  npx playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  npx playwright test example
    Runs the tests in a specific file.

  npx playwright test --debug
    Runs the tests in debug mode.

  npx playwright codegen
    Auto generate tests with Codegen.

We suggest that you begin by typing:

    npx playwright test
 */

import { test, expect } from "@playwright/test";

test("Inicializa corretamente", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Natural/);
  await expect(page.locator("html")).toContainText(
    /Naturais, frescos e cheios de sabor/,
  );
  await page.getByRole("link", { name: "Produtos" }).click();
  await page.waitForURL("**/produtos")
  await expect(page.getByText(/Encontrado/)).toBeVisible()
});

test("Faz o login corretamente", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Ir para login" }).click();

  await expect(page.getByText("Que bom te ver de volta")).toBeVisible();

  await page.locator("#login-username").fill("TEST_CART");
  await page.locator("#login-password").fill("TEST_CART");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/produtos");

  await expect(page.getByText(/Encontrado/i)).toBeVisible();
});

test("Cria novo usuário corretamente", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Ir para login" }).click();

  await expect(page.getByText("Que bom te ver de volta")).toBeVisible();
  await page.getByRole("link", { name: /Aqui/i }).click();

  await page
    .locator("#register-username")
    .fill(`TEST_CART${Math.random() * 7111}`);
  await page.locator("#register-password").fill("TEST_CART");

  await page.getByRole("button", { name: "Registrar" }).click();
  await page.waitForURL("**/produtos");

  await expect(page.getByText(/Encontrado/i)).toBeVisible();
});

test("Acessar e adicionar produtos", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Ir para login" }).click();

  await page.locator("#login-username").fill("TEST_CART");
  await page.locator("#login-password").fill("TEST_CART");

  await page.getByRole("button", { name: "Entrar" }).click();

  await page.waitForURL("**/produtos");
  await page.getByRole("button",{name:/Veja mais sobre Maçã Fuji/i}).click()
  await expect(page.getByText(/Digite uma quantidade/i)).toBeVisible()
  await page.getByPlaceholder(/digite uma quantidade/i).fill("10")
  await page.getByRole("button",{name:/Adicionar ao carrinho/i})
});

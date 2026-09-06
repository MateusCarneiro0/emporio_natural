import { test, expect } from "@playwright/test";
import { addProductInCart, goToLink, loginUser } from "./constants_e2e";

const session_username_auth = `TEST_AUTH${Math.floor(Math.random() * 2500)}`;
const session_username_auth_mobile = `TEST_AUTH${Math.floor(Math.random() * 2500)}`;
test.describe.configure({ mode: "serial" });
test.describe("Testando quando um usuário cria uma nova conta a sessão persite", () => {
  test.beforeEach(async ({ page }) => {
    page.goto("/");
  });
  test("No desktop", async ({ page }) => {
    await goToLink(page, "Ir para login", "i");

    await expect(page.getByText("Que bom te ver de volta")).toBeVisible();
    await page.getByRole("link", { name: /Aqui/i }).click();

    await page.locator("#register-username").fill(session_username_auth);
    await page.locator("#register-password").fill("TEST_CART");

    await page.getByRole("button", { name: "Registrar" }).click();
    await page.waitForURL("**/produtos");

    await expect(page.getByText(/encontrados/i)).toBeVisible();

    await addProductInCart(page, "Veja mais sobre Laranja Pera", 10, false);

    await page.reload();

    await expect(page.getByText("Carrinho").first()).toBeVisible();
    await expect(page.getByText("10")).toBeVisible();
  });

  test("No celular", async ({ page }) => {
    await page.setViewportSize({ width: 380, height: 840 });

    await goToLink(page, "Ir para login", "i", true);

    await expect(page.getByText("Que bom te ver de volta")).toBeVisible();
    await page.getByRole("link", { name: /Aqui/i }).click();

    await page.locator("#register-username").fill(session_username_auth_mobile);
    await page.locator("#register-password").fill("TEST_CART");

    await page.getByRole("button", { name: "Registrar" }).click();
    await page.waitForURL("**/produtos");

    await expect(page.getByText(/encontrados/i)).toBeVisible();

    const textRegProduct2 = new RegExp("Veja mais sobre Laranja Pera", "i");

    await page.getByRole("button", { name: textRegProduct2 }).click();
    await expect(page.getByText(/Digite uma quantidade/i)).toBeVisible();

    await page.getByPlaceholder(/digite uma quantidade/i).fill(String(10));
    await page.getByRole("button", { name: /o carrinho/ }).click();
    await page.waitForURL("**/cart");
    await expect(page.getByText("Laranja Pera")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Laranja Pera")).toBeVisible();
  });
});
test.describe("Testando se quando um usuário se loga ele persiste sessão", () => {
  test("No desktop", async ({ page }) => {
    await loginUser(page, undefined, undefined, session_username_auth);

    await expect(page.getByText(/encontrados/i)).toBeVisible();
    await goToLink(page, "Carrinho", "i", false);

    await expect(page.getByText("Laranja Pera")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Laranja Pera")).toBeVisible();
  });

  test("No celular", async ({ page }) => {
    await page.setViewportSize({ width: 380, height: 840 });

    await loginUser(page, undefined, true, session_username_auth_mobile);

    await expect(page.getByText(/encontrados/i)).toBeVisible();

    await goToLink(page, "Carrinho", "i", true);
    await expect(page.getByText("Laranja Pera")).toBeVisible();
    await page.reload();

    await expect(page.getByText("Laranja Pera")).toBeVisible();
  });
});

test.describe("Testando se usuário consegue sair da conta", () => {
  test("No desktop", async ({ page }) => {
    await loginUser(page, undefined, undefined, session_username_auth);
    await page.getByRole("button", { name: /Sair da conta/i }).click();
    
    await goToLink(page, "ir para produtos", "i", false);
    await page
      .getByRole("button", { name: /Veja mais sobre Laranja Pera/i })
      .click();
    await expect(page.getByText(/Bom te ver de volta/i).first()).toBeVisible();
  });
  test("No celular", async ({ page }) => {
    await page.setViewportSize({width:380,height:840})

    await loginUser(page, undefined, true, session_username_auth_mobile);
    await page.waitForURL("**/produtos")
    await page.waitForTimeout(5000)

    await page.getByRole("button", { name: "Abrir menu de navegação" }).click();

    await page.getByRole("button", { name: "Sair da conta" }).click();
    
    await page
      .getByRole("button", { name: /Veja mais sobre Laranja Pera/i })
      .click();
    await expect(page.getByText(/Bom te ver de volta/i).first()).toBeVisible();
  });
});
test("Se token de acesso expirar usuário persiste sessão com refresh token", async ({
  page,
  context,
}) => {
  await loginUser(page, undefined, false, session_username_auth);
  await page.waitForLoadState("networkidle");

  await context.clearCookies({ name: "acess_token" });

  await goToLink(page, "Carrinho", "i", false);

  await expect(page.getByText(/Laranja Pera/i)).toBeVisible();

  await page.reload();

  await expect(page.getByText(/Laranja Pera/i)).toBeVisible();
});

test("Se token de acesso e de refresh acabarem, usuário deve sair da conta", async ({
  page,
  context,
}) => {
  await loginUser(page, undefined, false, session_username_auth);

  await page.waitForLoadState("networkidle");
  await context.clearCookies({ name: "acess_token" });
  await context.clearCookies({ name: "refresh_token" });

  await addProductInCart(page, "Veja mais sobre Laranja Pera", 10, false);

  await expect(page.getByText(/Que bom te ver de volta/i)).toBeVisible();
});

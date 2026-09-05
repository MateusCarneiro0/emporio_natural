import { test, expect } from "@playwright/test";
import { goToLink, loginUser } from "./constants_e2e";
import requestJson from "../api/requestJson";

const session_username_products = `TEST_CART${Math.floor(Math.random()*1000)}`
const session_username_products_mobile = `TEST_CART${Math.floor(Math.random()*1000)}`

test.beforeAll(async () => {
  await requestJson(`users/createnewuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: session_username_products, password: "TEST_CART" }),
  });
  await requestJson(`users/createnewuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: session_username_products_mobile,
      password: "TEST_CART",
    }),
  });
});

test("Testando se quando há erro renderiza página de erro", async ({
  page,
}) => {
  await page.route(`${process.env.VITE_API_URL}/`, (route) => {
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Products not found" }),
    });
  });

  await page.goto("/");

  await goToLink(page, "ir para produtos", "i");

  await expect(
    page.getByRole("button", { name: "Buscar produtos" }),
  ).toBeVisible();
});

test("Testando se houver um erro na página de um produto específico", async ({
  page,
}) => {
  const textRegProduct = new RegExp(`Veja mais sobre Laranja Pera`, "i");
  await loginUser(page,undefined,undefined,session_username_products);
  await page.route(
    `${process.env.VITE_API_URL}/products/yezP-VuX0Bg`,
    (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Error in found product" }),
      });
    },
  );

  await page.getByRole("button", { name: textRegProduct }).click();
  await expect(
    page.getByRole("button", { name: "Buscar produto novamente" }),
  ).toBeVisible();
});

test("Testando se quando há erro renderiza página de erro(Mobile)", async ({
  page,
}) => {
  
  await page.route(`${process.env.VITE_API_URL}/`, (route) => {
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Products not found" }),
    });
  });
  await page.setViewportSize({ width: 380, height: 840 });
  await page.goto("/");

  await goToLink(page, "ir para produtos", "i", true);
  await expect(
    page.getByRole("button", { name: "Buscar produtos" }),
  ).toBeVisible();
});

test("Testando se houver um erro na página de um produto específico(Mobile)", async ({
  page,
}) => {
  await page.route(
    `${process.env.VITE_API_URL}/products/yezP-VuX0Bg`,
    (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Error in found product" }),
      });
    },
  );
  await page.setViewportSize({ width: 380, height: 840 });

  const textRegProduct = new RegExp(`Veja mais sobre Laranja Pera`, "i");

  await loginUser(page,"TEST_CART",true,session_username_products_mobile);

  await page.getByRole("button", { name: textRegProduct }).click();


  await expect(
    page.getByRole("button", { name: /Buscar produto novamente/i }),
  ).toBeVisible();
});

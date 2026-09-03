import { test, expect } from "@playwright/test";
import { BASE_URL } from "../secretKeys";
import { goToLink, loginUser } from "./userflow.spec";
test("Testando se quando há erro renderiza página de erro", async ({
  page,
}) => {
  await page.route(`${BASE_URL}/products`, (route) => {
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: { error: "Products not found" },
    });
  });
  await page.goto("/");

  await goToLink(page, "Produtos", "");
  await expect(
    page.getByText("Erro em buscar os produtos, tente novamente mais tarde."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Buscar produtos" }).click();
});

test("Testando se houver um erro na página de um produto específico", async ({
  page,
}) => {
  const textRegProduct = new RegExp(
    `Veja mais sobre Laranja Pera`,
    "i",
  );
  await loginUser(page);
  await page.route(`${BASE_URL}/products/yezP-VuX0Bg`, (route) => {
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: { error: "Error in found product" },
    });
  });
  await page.getByRole("button",{name:textRegProduct}).click();
  await expect(page.getByRole("button",{name:"Buscar produto novamente"})).toBeVisible()
});

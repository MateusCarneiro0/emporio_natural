import { test, expect } from "@playwright/test";
import {BASE_URL} from "../secretKeys"
test("Testando se quando há erro renderiza página de erro", async ({
  page,
}) => {
  await page.route(`${BASE_URL}/products`, route => {
    route.fulfill({
      status:500,
      contentType:"application/json",
      body:{error:"Products not found"}
    })
  })
  await page.goto("/");
  
  await page.getByRole("button", { name: "Produtos" }).click();
  await expect(page.getByText("Erro em buscar os produtos, tente novamente mais tarde.")).toBeVisible();

  await page.getByRole("button", { name: "Buscar produtos" }).click();
});

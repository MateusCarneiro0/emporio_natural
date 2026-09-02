import {test,expect} from "@playwright/test"
import { rejected } from "../slices/productsSlice"

test("Testando se quando há erro renderiza página de erro", async ({page}) => {
    await page.goto("/")
    const store = await page.evaluate(() => window.__STORE__)
    store.dispatch(rejected("Erro em buscar produtos"))
    await expect(page.getByText("Erro em buscar produtos")).toBeVisible()

    await page.getByRole("button",{name:"Buscar produtos"}).click()
    await expect(page.getByText(/encontrados/)).toBeVisible();
})
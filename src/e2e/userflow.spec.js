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

import { test, expect } from '@playwright/test';

test('Começa corretamente', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Natural/)
  await expect(page.locator("html")).toContainText(/Naturais, frescos e cheios de sabor/)

});

test("Abre links", async ({page}) => {
    await page.goto("/")
    
})
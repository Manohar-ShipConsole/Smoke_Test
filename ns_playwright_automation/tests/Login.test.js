
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages_objects/LoginPage.js';
import config from '../configuration/config.js';

test.describe('Login Tests', () => {

  test('Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto(config.baseURL);

    await loginPage.loginWithCredentials(config.username, config.password);

    // Assert welcome text
    await expect(page.locator(loginPage.welcometext)).toBeVisible();
  });

});


import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages_objects/LoginPage.js';
import { IndexPage } from '../pages_objects/IndexPage.js';
import config from '../configuration/config.js';

// FreightQuote must stay last: navigating to it collapses the sidebar to icon-only,
// which breaks any menu click attempted after it.
const menuItems = [
    { name: 'Shipping', click: 'clickShipping', urlPart: 'requestType=Main', title: 'ShipConsole :: Shipping' },
    { name: 'LTL Shipping', click: 'clickLTLShipping', urlPart: 'requestType=LTLShipping', title: 'ShipConsole :: LTL Shipping' },
    { name: 'Adhoc Shipping', click: 'clickAdhocShipping', urlPart: 'requestType=Adhoc', title: 'Adhoc Shipping' },
    { name: 'Tracking', click: 'clicktracking', urlPart: 'requestType=Tracking', title: 'ShipConsole :: Tracking Page' },
    { name: 'Reports', click: 'clickreports', urlPart: 'requestType=Reports1', title: 'ShipConsole :: Reports' },
    { name: 'Package Dimensions', click: 'clickpackagedimentions', urlPart: 'requestType=PackageDimensions', title: 'ShipConsole :: Package Dimensions' },
    { name: 'End Of Day', click: 'clickendofday', urlPart: 'requestType=EOD', title: 'ShipConsole :: End of Day Manifest Selection Page' },
    { name: 'Import Orders', click: 'clickImportOrders', urlPart: 'requestType=UploadOrders', title: 'ShipConsole :: Import Orders' },
    { name: 'Erp Sync', click: 'clickErpSync', urlPart: 'requestType=ERPSync', title: 'ShipConsole :: Erp Sync with ShipConsole' },
    { name: 'Freight Quote', click: 'clickFreightQuote', urlPart: 'requestType=FreightQuote', title: 'ShipConsole :: FreightQuote' },
];


test.describe('Menu Navigation', () => {


    test('Login once, navigate to every menu item, verify each page, then logout', async ({ page }) => {
        const login = new LoginPage(page);
        const index = new IndexPage(page);

        await page.goto(config.baseURL);
        await login.loginWithCredentials(config.username, config.password);
        await page.waitForTimeout(5000);
        await expect.soft(login.welcometext).toBeVisible();

        for (const item of menuItems) {
            await page.waitForTimeout(1000); // 1 sec delay before clicking page navigation
            if (item.isNewTab) {
                const newPage = await index[item.click]();
                await newPage.waitForTimeout(1000); // 1 sec delay before checking assertions on new tab
                await expect.soft(newPage, `${item.name} should navigate to the correct URL`).toHaveURL(new RegExp(item.urlPart));
                //if (item.headingText) {
                //    const tag = item.headingTag || '*';
                //    await expect.soft(newPage.locator(tag, { hasText: item.headingText }).first(), `${item.name} text should be visible`).toBeVisible();
                //}
                await newPage.close();
            } else {
                await index[item.click]();
                await page.waitForTimeout(1000); // 1 sec delay before checking assertions
                await expect.soft(page, `${item.name} should navigate to the correct URL`).toHaveURL(new RegExp(item.urlPart));
                await expect.soft(page, `${item.name} should load with the correct page title`).toHaveTitle(item.title);
            }
        }

        await index.logout();
        await expect(index.logoutMessage).toBeVisible();
    });

});


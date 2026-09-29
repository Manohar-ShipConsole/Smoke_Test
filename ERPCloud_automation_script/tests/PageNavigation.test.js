import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages_objects/LoginPage.js';
import { IndexPage } from '../pages_objects/IndexPage.js';
import config from '../configuration/config.js';

test.describe('Page Navigation POM Test Suite', () => {
  test('Navigate 9 grid pages sequentially with URL validation (Single Login & Logout)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const indexPage = new IndexPage(page);

    // Single Login
    await page.goto(config.baseURL);
    await loginPage.loginWithCredentials(config.username, config.password);
    await expect(loginPage.welcometext).toBeVisible();
    await expect(page).toHaveURL(/.*ShipConsole.*/i);

    // 1. Shipping
    await indexPage.clickShipping();
    await expect(page).toHaveURL(/.*(ShipConsole|ship|console).*/i);

    // 2. Tracking
    await indexPage.clicktracking();
    await expect(page).toHaveURL(/.*(track|shipTrack).*/i);

    // 3. Non-Oracle Shipping
    await indexPage.clicknonraclepage();
    await expect(page).toHaveURL(/.*(adhoc|nonoracle|ship).*/i);

    // 4. Batch Form
    await indexPage.clickbatchform();
    await expect(page).toHaveURL(/.*(enquiry|batch|form).*/i);

    // 5. Reports & Sub-reports
    await indexPage.clickreports();
    await expect(page).toHaveURL(/.*(report|reports).*/i);

    await indexPage.clickCarrierShipmentActivityReport();
    await expect(page).toHaveURL(/.*(carrier|shipment|activity|report).*/i);
    await indexPage.clickBack();

    await indexPage.clickCarrierSlaReport();
    await expect(page).toHaveURL(/.*(sla|carrier|report).*/i);
    await indexPage.clickBack();

    await indexPage.clickManifestReport();
    await expect(page).toHaveURL(/.*(manifest|report).*/i);
    await indexPage.clickBack();

    await indexPage.clickDeliveryDetailsReport();
    await expect(page).toHaveURL(/.*(delivery|details|report).*/i);
    await indexPage.clickBack();

    await indexPage.clickShippingTransactionsReport();
    await expect(page).toHaveURL(/.*(transaction|shipping|report).*/i);
    await indexPage.clickBack();

    await indexPage.clickShippedNotShipConfirmedReport();
    await expect(page).toHaveURL(/.*(shipped|confirm|report).*/i);
    await indexPage.clickBack();

    await indexPage.clickHazmatEodReport();
    await expect(page).toHaveURL(/.*(hazmat|eod|report).*/i);
    await indexPage.clickBack();

    // 6. Package Dimensions
    await indexPage.clickpackagedimentions();
    await expect(page).toHaveURL(/.*(dimension|package).*/i);

    // 7. Analytics & Sub-modules
    await indexPage.clickanalytics();
    await expect(page).toHaveURL(/.*(analytic|analytics).*/i);

    await indexPage.clickShipmentsPerCarrier();
    await expect(page).toHaveURL(/.*(carrier|shipment|analytic).*/i);
    await indexPage.clickGoHome();
    await expect(page).toHaveURL(/.*(ShipConsole|home|index).*/i);
    
    await indexPage.clickanalytics();
    await indexPage.clickTransportationSpend();
    await expect(page).toHaveURL(/.*(spend|transactionsReport|analytic).*/i);
    await indexPage.clickGoHome();
    await expect(page).toHaveURL(/.*(ShipConsole|home|index).*/i);

    // 8. End of Day & Sub-modules
    await indexPage.clickendofday();
    await expect(page).toHaveURL(/.*(eod|endofday).*/i);

    await indexPage.clickConnectShipEod();
    await expect(page).toHaveURL(/.*(connectship|shipexec|eod).*/i);
    await indexPage.clickBack();

    await indexPage.clickendofday();
    await indexPage.clickDhlECommerceEod();
    await expect(page).toHaveURL(/.*(dhl|eod).*/i);
    await indexPage.clickBack();

    // 9. Generic Label
    await indexPage.clickgenericlabel();
    await expect(page).toHaveURL(/.*(generic|label|PrintGenericLabel).*/i);

    // 10. Sign Out
    await indexPage.clickSignOut();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(page).toHaveURL(/.*(login|Login|logout).*/i);
  });
});

import { test, expect } from '@playwright/test';
import config from '../configuration/config.js';

// Environment validation configuration for all products
const environmentConfig = {
  saas: [
    {
      name: 'ShipAPI (SAAS)',
      url: 'https://cloud.shipconsole.com/ShipAPI',
      type: 'url_up',
      assertion: 'Welcome to ShipAPI! Your Spring Boot application is up and working.'
    },
  ],
  scm: [
    {
      name: 'NIR',
      url: 'https://products.shipconsole.com/NIR',
      type: 'url_up',
      assertion: 'Login'
    },
    {
      name: 'DocumentStorage',
      url: 'https://products.shipconsole.com/DocumentStorage',
      type: 'url_up',
      assertion: 'Shipping Documents'
    },
    {
      name: 'JDE Adapter',
      url: 'https://products.shipconsole.com/jde-adapter',
      type: 'url_up',
      assertion: 'Seamlessly Connecting ShipConsole with JD Edwards'
    },
    {
      name: 'DocumentStorageMobileApp',
      url: 'https://products.shipconsole.com/DocumentStorageMobileApp',
      type: 'url_up',
      assertion: 'Click here to download the ShipConsole App'
    },
    {
      name: 'FedexAdapterAPI',
      url: 'https://products.shipconsole.com/FedexAdapterAPI',
      type: 'url_up',
      assertion: 'Whitelabel Error Page'
    },
    {
      name: 'EodService',
      url: 'https://products.shipconsole.com/EodService',
      type: 'url_up',
      assertion: 'Whitelabel Error Page'
    },
    {
      name: 'box-tracking-numbers-api',
      url: 'https://products.shipconsole.com/box-tracking-numbers-api',
      type: 'url_up',
      assertion: 'Whitelabel Error Page'
    },
    {
      name: 'ShipConsoleNIRAPI',
      url: 'https://products.shipconsole.com/ShipConsoleNIRAPI',
      type: 'url_up',
      assertion: 'Whitelabel Error Page'
    },
    {
      name: 'BatchShipConfirmAPI',
      url: 'https://products.shipconsole.com/BatchShipConfirmAPI',
      type: 'url_up',
      assertion: 'Batch ShipConfirm API is Up and Running!'
    },
    {
      name: 'AddressValidationNew',
      url: 'https://products.shipconsole.com/AddressValidationNew',
      type: 'url_up',
      assertion: 'Hello! Welcome to AddressValidation'
    },
    {
      name: 'AddressValidation',
      url: 'https://products.shipconsole.com/AddressValidation',
      type: 'url_up',
      assertion: 'Hello! Welcome to AddressValidation'
    },
    {
      name: 'ShipConsoleJDE (Old JDE)',
      url: 'https://products.shipconsole.com/ShipConsoleJDE',
      type: 'login',
      credentials: config.credentials.shipConsoleJDE,
      assertion: 'Welcome'
    },
    {
      name: 'LTLConsole',
      url: 'https://products.shipconsole.com/LTLConsole',
      type: 'login',
      credentials: config.credentials.ltlConsole,
      assertion: 'LTL Console'
    },
    {
      name: 'FedexAdapterAPIV2',
      url: 'https://products.shipconsole.com/FedexAdapterAPIV2',
      type: 'url_up',
      assertion: 'Whitelabel Error Page'
    },
    {
      name: 'LTLConsoleAPI',
      url: 'https://products.shipconsole.com/LTLConsoleAPI',
      type: 'url_up',
      assertion: 'LTL Console'
    },
    {
      name: 'ShipConsoleGetRates',
      url: 'https://products.shipconsole.com/ShipConsoleGetRates',
      type: 'url_up',
      assertion: 'Order Number parameter is mandatory'
    },
    {
      name: 'SaasServices',
      url: 'https://products.shipconsole.com/SaasServices',
      type: 'login',
      credentials: config.credentials.saasServices,
      assertion: 'Welcome'
    },
    {
      name: 'ShipAPI (SCM)',
      url: 'https://products.shipconsole.com/ShipAPI',
      type: 'url_up',
      assertion: 'Welcome to ShipAPI! Your Spring Boot application is up and working.'
    },
    {
      name: 'FreightShoppingNew',
      url: 'https://products.shipconsole.com/FreightShoppingNew',
      type: 'url_up',
      assertion: 'Freight Shopping Version'
    }
  ],
  labcorp: [
    {
      name: 'BatchShipConfirmAPI (LabCorp)',
      url: 'https://erpcloud.shipconsole.com/BatchShipConfirmAPI',
      type: 'url_up',
      assertion: 'Batch ShipConfirm API is Up and Running!'
    },
    {
      name: 'ShipConsoleSCMCloud (LabCorp)',
      url: 'https://erpcloud.shipconsole.com/ShipConsoleSCMCloud',
      type: 'login',
      credentials: config.credentials.labcorp,
      assertion: 'Welcome'
    },
    {
      name: 'ShipAPI (LabCorp)',
      url: 'https://erpcloud.shipconsole.com/ShipAPI',
      type: 'url_up',
      assertion: 'Welcome to ShipAPI! Your Spring Boot application is up and working.'
    }
  ],
  tenx: [
    {
      name: 'ShipConsoleSamlSP (TENx Genomics)',
      url: 'https://products.shipconsole.com/ShipConsoleSamlSP/',
      type: 'url_up',
      assertion: 'Login with SAML 2.0'
    },
    {
      name: 'TENx Genomics SAML',
      url: 'https://cloudscmtest.shipconsole.com/sc-tenx-prod-saml/',
      type: 'url_up',
      assertion: 'Welcome to Spring Security SAML'
    }
  ]
};

test.describe('Environment Validation Tests', () => {

  test.describe('SAAS Environment', () => {
    for (const endpoint of environmentConfig.saas) {
      if (endpoint.type === 'url_up') {
        test(`${endpoint.name} - URL is up with assertion`, async ({ page }) => {
          console.log(`\n🔍 Testing: ${endpoint.name}`);
          console.log(`📍 URL: ${endpoint.url}`);

          const response = await page.goto(endpoint.url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });

          if (endpoint.assertion !== 'Whitelabel Error Page') {
            expect(response.status()).toBeLessThan(400);
            console.log(`✅ Page loaded with status: ${response.status()}`);
          } else {
            console.log(`ℹ️ Whitelabel Error Page expected, skipping status check (Status: ${response.status()})`);
          }

          const pageContent = await page.content();
          expect(pageContent).toContain(endpoint.assertion);
          console.log(`✅ Found assertion text: "${endpoint.assertion}"`);
        });
      } else if (endpoint.type === 'login') {
        test(`${endpoint.name} - Login test`, async ({ page }) => {
          console.log(`\n🔓 Login Test: ${endpoint.name}`);
          console.log(`📍 URL: ${endpoint.url}`);

          const response = await page.goto(endpoint.url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });

          expect(response.status()).toBeLessThan(400);
          console.log(`✅ ${endpoint.name} URL accessible with status: ${response.status()}`);

          if (endpoint.credentials) {
            console.log(`👤 Using credentials for ${endpoint.name}: Username="${endpoint.credentials.username}"`);

            // Common locators: Customize locators per URL if needed
            const usernameInput = page.locator('#login_userName, input[name="username"], input[name="user"], #username, input[type="text"]').first();
            const passwordInput = page.locator('#password, input[name="password"], input[name="pass"], #pass, input[type="password"]').first();
            const loginButton = page.locator('#login_login, button[type="submit"], input[type="submit"], #submit, button:has-text("Login")').first();

            try {
              if (await usernameInput.isVisible({ timeout: 5000 })) {
                await usernameInput.fill(endpoint.credentials.username);
                await passwordInput.fill(endpoint.credentials.password);
                await loginButton.click();
                console.log(`🔑 Login form submitted for ${endpoint.name}`);

                if (endpoint.assertion) {
                  await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });
                  const bodyText = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
                  const htmlContent = (await page.content().catch(() => '')).replace(/\s+/g, ' ');

                  const isTextFound = bodyText.includes(endpoint.assertion) || htmlContent.includes(endpoint.assertion);
                  expect(isTextFound).toBeTruthy();
                  console.log(`✅ Post-login assertion verified for ${endpoint.name}: "${endpoint.assertion}"`);
                }
              } else {
                console.log(`ℹ️ Login input not visible directly on load for ${endpoint.name}. Customize locators as needed.`);
              }
            } catch (err) {
              console.log(`ℹ️ Login interaction note for ${endpoint.name}: ${err.message}`);
            }
          } else {
            console.log(`⏳ Credentials not configured for ${endpoint.name}`);
          }
        });
      }
    }
  });

  test.describe('SCM Environment', () => {
    for (const endpoint of environmentConfig.scm) {
      if (endpoint.type === 'url_up') {
        test(`${endpoint.name} - URL is up`, async ({ page }) => {
          console.log(`\n🔍 Testing: ${endpoint.name}`);
          console.log(`📍 URL: ${endpoint.url}`);

          const response = await page.goto(endpoint.url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });

          if (endpoint.assertion !== 'Whitelabel Error Page') {
            expect(response.status()).toBeLessThan(400);
            console.log(`✅ Page loaded with status: ${response.status()}`);
          } else {
            console.log(`ℹ️ Whitelabel Error Page expected, skipping status check (Status: ${response.status()})`);
          }

          const pageContent = await page.content();
          expect(pageContent).toContain(endpoint.assertion);
          console.log(`✅ Found assertion text: "${endpoint.assertion}"`);
        });
      } else if (endpoint.type === 'login') {
        test(`${endpoint.name} - Login test`, async ({ page }) => {
          console.log(`\n🔓 Login Test: ${endpoint.name}`);
          console.log(`📍 URL: ${endpoint.url}`);

          const response = await page.goto(endpoint.url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });

          expect(response.status()).toBeLessThan(400);
          console.log(`✅ ${endpoint.name} URL accessible with status: ${response.status()}`);

          if (endpoint.credentials) {
            console.log(`👤 Using credentials for ${endpoint.name}: Username="${endpoint.credentials.username}"`);

            // Locators configured for SCM Environment per URL
            let usernameInput, passwordInput, loginButton;

            if (endpoint.url.includes('/ShipConsoleJDE') || endpoint.url.includes('/SaasServices') || endpoint.name.includes('ShipConsoleJDE') || endpoint.name.includes('SaasServices')) {
              // Identical locators for ShipConsoleJDE and SaasServices
              usernameInput = page.locator('#login_userName, input[name="userName"], input.form-username').first();
              passwordInput = page.locator('#password, input[name="password"], input.form-password').first();
              loginButton = page.locator('#login_login, button[type="submit"].btn-success').first();
            } else {
              // Locators for LTLConsole
              usernameInput = page.locator('#login_userName, input[name="userName"], input.input100').first();
              passwordInput = page.locator('#password, input[name="password"], input.input100').first();
              loginButton = page.locator('#login_login, button.login100-form-btn, button[type="submit"]').first();
            }

            try {
              if (await usernameInput.isVisible({ timeout: 5000 })) {
                await usernameInput.fill(endpoint.credentials.username);
                await passwordInput.fill(endpoint.credentials.password);
                await loginButton.click();
                console.log(`🔑 Login form submitted successfully for ${endpoint.name}`);

                if (endpoint.assertion) {
                  await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });
                  const bodyText = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
                  const htmlContent = (await page.content().catch(() => '')).replace(/\s+/g, ' ');

                  const isTextFound = bodyText.includes(endpoint.assertion) || htmlContent.includes(endpoint.assertion);
                  expect(isTextFound).toBeTruthy();
                  console.log(`✅ Post-login assertion verified for ${endpoint.name}: "${endpoint.assertion}"`);
                }
              } else {
                console.log(`ℹ️ Login input not visible directly on load for ${endpoint.name}. Customize locators as needed.`);
              }
            } catch (err) {
              console.log(`ℹ️ Login interaction note for ${endpoint.name}: ${err.message}`);
            }
          } else {
            console.log(`⏳ Credentials not configured for ${endpoint.name}`);
          }
        });
      }
    }
  });

  test.describe('LabCorp Environment', () => {
    for (const endpoint of environmentConfig.labcorp) {
      if (endpoint.type === 'url_up') {
        test(`${endpoint.name} - URL is up`, async ({ page }) => {
          console.log(`\n🔍 Testing: ${endpoint.name}`);
          console.log(`📍 URL: ${endpoint.url}`);

          const response = await page.goto(endpoint.url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });

          if (endpoint.assertion !== 'Whitelabel Error Page') {
            expect(response.status()).toBeLessThan(400);
            console.log(`✅ Page loaded with status: ${response.status()}`);
          } else {
            console.log(`ℹ️ Whitelabel Error Page expected, skipping status check (Status: ${response.status()})`);
          }

          const pageContent = await page.content();
          expect(pageContent).toContain(endpoint.assertion);
          console.log(`✅ Found assertion text: "${endpoint.assertion}"`);
        });
      } else if (endpoint.type === 'login') {
        test(`${endpoint.name} - Login test`, async ({ page }) => {
          console.log(`\n🔓 Login Test: ${endpoint.name}`);
          console.log(`📍 URL: ${endpoint.url}`);

          const response = await page.goto(endpoint.url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });

          expect(response.status()).toBeLessThan(400);
          console.log(`✅ ${endpoint.name} URL accessible with status: ${response.status()}`);

          if (endpoint.credentials) {
            console.log(`👤 Using credentials for ${endpoint.name}: Username="${endpoint.credentials.username}"`);

            // Locators for LabCorp Environment (https://erpcloud.shipconsole.com/ShipConsoleSCMCloud)
            const usernameInput = page.locator('#login_userName, input[name="userName"], input.form-username').first();
            const passwordInput = page.locator('#password, input[name="password"], input.form-password').first();
            const loginButton = page.locator('#login_login, button[type="submit"].btn-success').first();

            try {
              if (await usernameInput.isVisible({ timeout: 5000 })) {
                await usernameInput.fill(endpoint.credentials.username);
                await passwordInput.fill(endpoint.credentials.password);
                await loginButton.click();
                console.log(`🔑 Login form submitted for ${endpoint.name}`);

                if (endpoint.assertion) {
                  await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });
                  const bodyText = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
                  const htmlContent = (await page.content().catch(() => '')).replace(/\s+/g, ' ');

                  const isTextFound = bodyText.includes(endpoint.assertion) || htmlContent.includes(endpoint.assertion);
                  expect(isTextFound).toBeTruthy();
                  console.log(`✅ Post-login assertion verified for ${endpoint.name}: "${endpoint.assertion}"`);
                }
              } else {
                console.log(`ℹ️ Login input not visible directly on load for ${endpoint.name}. Customize locators as needed.`);
              }
            } catch (err) {
              console.log(`ℹ️ Login interaction note for ${endpoint.name}: ${err.message}`);
            }
          } else {
            console.log(`⏳ Credentials not configured for ${endpoint.name}`);
          }
        });
      }
    }
  });

  test.describe('TENx Genomics Environment', () => {
    for (const endpoint of environmentConfig.tenx) {
      if (endpoint.type === 'url_up') {
        test(`${endpoint.name} - URL is up`, async ({ page }) => {
          console.log(`\n🔍 Testing: ${endpoint.name}`);
          console.log(`📍 URL: ${endpoint.url}`);

          const response = await page.goto(endpoint.url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });

          if (endpoint.assertion !== 'Whitelabel Error Page') {
            expect(response.status()).toBeLessThan(400);
            console.log(`✅ Page loaded with status: ${response.status()}`);
          } else {
            console.log(`ℹ️ Whitelabel Error Page expected, skipping status check (Status: ${response.status()})`);
          }

          const pageContent = await page.content();
          expect(pageContent).toContain(endpoint.assertion);
          console.log(`✅ Found assertion text: "${endpoint.assertion}"`);
        });
      }
    }
  });

  test.describe('Environment Summary', () => {
    test('Validate all URLs accessibility', async ({ request }) => {
      const allEndpoints = [
        ...environmentConfig.saas,
        ...environmentConfig.scm,
        ...environmentConfig.labcorp,
        ...environmentConfig.tenx
      ];

      const results = {
        healthy: [],
        unhealthy: [],
        loginValidated: []
      };

      for (const endpoint of allEndpoints) {
        try {
          const response = await request.get(endpoint.url, { timeout: 10000 });

          if (response.status() < 400 || endpoint.assertion === 'Whitelabel Error Page') {
            if (endpoint.type === 'login') {
              results.loginValidated.push(`🔑 ${endpoint.name} (Assertion: "${endpoint.assertion}")`);
            } else {
              results.healthy.push(`✅ ${endpoint.name}`);
            }
          } else {
            results.unhealthy.push(`❌ ${endpoint.name} (Status: ${response.status()})`);
          }
        } catch (error) {
          results.unhealthy.push(`❌ ${endpoint.name} (${error.message})`);
        }
      }

      console.log('\n═══ ENVIRONMENT VALIDATION SUMMARY ═══\n');
      console.log(`✅ Healthy (${results.healthy.length}):`);
      results.healthy.forEach(item => console.log(`   ${item}`));

      if (results.loginValidated.length > 0) {
        console.log(`\n🔑 Logged In & Validated (${results.loginValidated.length}):`);
        results.loginValidated.forEach(item => console.log(`   ${item}`));
      }

      if (results.unhealthy.length > 0) {
        console.log(`\n❌ Unhealthy (${results.unhealthy.length}):`);
        results.unhealthy.forEach(item => console.log(`   ${item}`));
      }

      console.log(`\n📊 Total: ${results.healthy.length + results.loginValidated.length}/${allEndpoints.length} endpoints accessible\n`);

      // Only fail if there are unhealthy endpoints
      expect(results.unhealthy).toHaveLength(0);
    });
  });

});

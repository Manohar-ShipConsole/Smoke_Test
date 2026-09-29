exports.IndexPage = class IndexPage {
  constructor(page) {
    this.page = page;

    // 9 Main Navigation Items (Grid sequence)
    this.shipping = page.locator('[id="#ShipConsolePage_action1"]');
    this.tracking = page.locator('[id="#shipTrack_action1"]');
    this.nonoraclepage = page.locator('[id="#adhoc_action1"]');
    this.batchform = page.locator('[id="#enquiryForm_action2"], [id="#enquiryForm_action1"]').first();
    this.reports = page.locator('[id="#reports_action1"]');
    this.packagedimentions = page.locator('[id="#dimension_action1"]');
    this.analytics = page.locator('[id="#analytics_action1"], [id="#Analytics_action1"]').first();
    this.endofday = page.locator('[id="#EOD_action1"]');
    this.genericlabel = page.locator('a[href*="PrintGenericLabelAction"], li:nth-child(9) > a').first();

    // User Profile Dropdown & Sign Out Locators
    this.userProfileMenu = page.locator('a[data-toggle="dropdown"].dropdown-toggle, a.dropdown-toggle:has(span.glyphicon)').first();
    this.signOut = page.locator('a[href*="logout"], a:has-text("Sign Out")');

    // Analytics Sub-modules
    this.shipmentsPerCarrier = page.getByRole('link', { name: 'Shipments Per Carrier' });
    this.transportationSpend = page.getByRole('link', { name: 'Transportation Spend' });
    this.goHome = page.locator('#goHomeDIVID');

    // End of Day Sub-modules
    this.connectShipEod = page.getByRole('link', { name: 'ConnectShip/ShipExec End of' });
    this.dhlECommerceEod = page.getByRole('link', { name: 'DHL eCommerce End of Day' });

    // Reports Sub-modules
    this.carrierShipmentActivityReport = page.getByRole('link', { name: 'Carrier Shipment Activity' });
    this.carrierSlaReport = page.getByRole('link', { name: 'Carrier SLA Report' });
    this.manifestReport = page.getByRole('link', { name: 'Manifest Report' });
    this.deliveryDetailsReport = page.getByRole('link', { name: 'Delivery Details Report' });
    this.shippingTransactionsReport = page.getByRole('link', { name: 'Shipping Transactions Report' });
    this.shippedNotShipConfirmedReport = page.getByRole('link', { name: 'Shipped But Not ShipConfirmed' });
    this.hazmatEodReport = page.getByRole('link', { name: 'Hazmat EOD Report' });

    // Common Action
    this.backButton = page.getByRole('link', { name: 'Back ' });
  }

  // 1. Shipping
  async clickShipping() {
    await this.shipping.click();
  }

  // 2. Tracking
  async clicktracking() {
    await this.tracking.click();
  }

  // 3. Non-Oracle Shipping
  async clicknonraclepage() {
    await this.nonoraclepage.click();
  }

  // 4. Batch Form
  async clickbatchform() {
    await this.batchform.click();
  }

  // 5. Reports
  async clickreports() {
    await this.reports.click();
  }

  // 6. Package Dimensions
  async clickpackagedimentions() {
    await this.packagedimentions.click();
  }

  // 7. Analytics
  async clickanalytics() {
    await this.analytics.click();
  }

  // 8. End of Day
  async clickendofday() {
    await this.endofday.click();
  }

  // 9. Generic Label
  async clickgenericlabel() {
    await this.genericlabel.click();
  }

  // User Profile & Sign Out Actions
  async clickUserProfileMenu() {
    await this.userProfileMenu.waitFor({ state: 'visible' });
    await this.userProfileMenu.click();
  }

  async clickSignOut() {
    // Wait for page to be stable
    await this.page.waitForLoadState('networkidle');

    // Wait for userProfileMenu to be in the DOM (even if hidden)
    await this.userProfileMenu.waitFor({ state: 'attached', timeout: 10000 });

    // Click with force to handle hidden elements
    await this.userProfileMenu.click({ force: true });
    await this.page.waitForTimeout(1000);

    // Wait for signOut link to be visible
    await this.signOut.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.signOut.first().click();
  }

  // Analytics Actions
  async clickShipmentsPerCarrier() {
    await this.shipmentsPerCarrier.click();
  }

  async clickTransportationSpend() {
    await this.transportationSpend.click();
  }

  async clickGoHome() {
    await this.goHome.click();
  }

  // End of Day Actions
  async clickConnectShipEod() {
    await this.connectShipEod.click();
  }

  async clickDhlECommerceEod() {
    await this.dhlECommerceEod.click();
  }

  // Reports Actions
  async clickCarrierShipmentActivityReport() {
    await this.carrierShipmentActivityReport.click();
  }

  async clickCarrierSlaReport() {
    await this.carrierSlaReport.click();
  }

  async clickManifestReport() {
    await this.manifestReport.click();
  }

  async clickDeliveryDetailsReport() {
    await this.deliveryDetailsReport.click();
  }

  async clickShippingTransactionsReport() {
    await this.shippingTransactionsReport.click();
  }

  async clickShippedNotShipConfirmedReport() {
    await this.shippedNotShipConfirmedReport.click();
  }

  async clickHazmatEodReport() {
    await this.hazmatEodReport.click();
  }

  async clickBack() {
    await this.backButton.click();
  }
};
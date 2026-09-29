
export class IndexPage {
  constructor(page) {
    this.page = page;

    this.shipping = page.locator('[id="\\#ShipConsolePage_action1"]');
    this.LTLShipping = page.locator('[id="\\#freightShipment_action1"]');
    this.adhocShipping = page.locator('[id="\\#adhoc_action1"]').filter({ hasText: 'Adhoc Shipping' });
    this.enhancedReturnShipments = page.locator('[id="\\#buttons_EnhancedReturnShipments"]');
    this.batchform = page.locator('[id="\\#enquiryForm_action1"]');
    this.freightQuote = page.locator('[id="\\#FreightQuote_action1"]');
    this.tracking = page.locator('[id="\\#shipTrack_action1"]');
    this.reports = page.locator('a[href*="requestType=Reports1"]');
    this.packagedimentions = page.locator('[id="\\#dimension_action1"]');
    this.endofday = page.locator('[id="\\#EOD_action1"]');
    this.importOrders = page.locator('[id="\\#adhoc_action1"]').filter({ hasText: 'Import Orders' });
    this.erpSync = page.locator('[id="\\#erpSync_action1"]');
    this.masterBOL = page.locator('[id="\\#masterBOL_action1"]');
    this.shippingDocuments = page.locator('a', { hasText: 'Shipping Documents' });
    this.uploadDocuments = page.locator('a', { hasText: 'Upload Documents' });

    this.profileDropdownToggle = page.locator('a.dropdown-toggle', { has: page.locator('#profileicon') });
    this.logoutLink = page.locator('#Logout');
    this.logoutMessage = page.getByText('You are successfully logged out');
  }

  async clickShipping() {
    await this.shipping.waitFor({ state: 'visible' });
    await this.shipping.click();
  }
  async clickLTLShipping() { await this.LTLShipping.click(); }
  async clickAdhocShipping() { await this.adhocShipping.click(); }
  async clickEnhancedReturnShipments() { await this.enhancedReturnShipments.click(); }
  async clickBatchForm() { await this.batchform.click(); }
  async clickFreightQuote() { await this.freightQuote.click(); }
  async clickTracking() { await this.tracking.click(); }
  async clickReports() { await this.reports.click(); }
  async clickPackageDimensions() { await this.packagedimentions.click(); }
  async clickEndOfDay() { await this.endofday.click(); }
  async clickImportOrders() { await this.importOrders.click(); }
  async clickErpSync() { await this.erpSync.click(); }
  async clickMasterBOL() { await this.masterBOL.click(); }

  async clickShippingDocuments() {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.shippingDocuments.click(),
    ]);
    await popup.waitForLoadState();
    return popup;
  }
  async clickUploadDocuments() {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.uploadDocuments.click(),
    ]);
    await popup.waitForLoadState();
    return popup;
  }

  async logout() {
    await this.profileDropdownToggle.click();
    await this.logoutLink.click();
  }
}

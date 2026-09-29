
export class IndexPage {
  constructor(page) {
    this.page = page;

    //this.shipping = page.locator('#ShipConsolePage_action1');
    this.shipping = page.locator('[id="\\#ShipConsolePage_action1"]');
    this.LTLShipping = page.locator('[id="\\#freightShipment_action1"]');
    this.adhocShipping = page.locator('[id="\\#adhoc_action1"]').filter({ hasText: 'Adhoc Shipping' });
    this.freightQuote = page.locator('[id="\\#FreightQuote_action1"]');
    this.tracking = page.locator('[id="\\#shipTrack_action1"]');
    this.reports = page.locator('a[href*="requestType=Reports1"]');
    this.packagedimentions = page.locator('[id="\\#dimension_action1"]');
    this.endofday = page.locator('[id="\\#EOD_action1"]');
    this.importOrders = page.locator('[id="\\#adhoc_action1"]').filter({ hasText: 'Import Orders' });
    this.erpSync = page.locator('[id="\\#erpSync_action1"]');
    this.masterBOL = page.locator('[id="\\#masterBOL_action1"]');
    this.batchShipId = page.locator('#BatchShipId a');
    this.shippingDocuments = page.locator('a[name="\\#getDoc"]');
    this.uploadDocuments = page.locator('a[name="\\#saveDocs"]');
    this.profileDropdownToggle = page.locator('a.dropdown-toggle', { has: page.locator('#profileicon') });
    this.logoutLink = page.locator('#Logout');
    this.logoutMessage = page.getByText('You are successfully logged out');
    this.loader = page.locator('#loader');
  }

  async waitForLoader() {
    await this.page.waitForTimeout(1000);
    await this.loader.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => { });
  }

  async clickShipping() { await this.waitForLoader(); await this.shipping.click(); }
  async clickLTLShipping() { await this.waitForLoader(); await this.LTLShipping.click(); }
  async clickAdhocShipping() { await this.waitForLoader(); await this.adhocShipping.click(); }
  async clickFreightQuote() { await this.waitForLoader(); await this.freightQuote.click(); }
  async clicktracking() { await this.waitForLoader(); await this.tracking.click(); }
  async clickreports() { await this.waitForLoader(); await this.reports.click(); }
  async clickpackagedimentions() { await this.waitForLoader(); await this.packagedimentions.click(); }
  async clickendofday() { await this.waitForLoader(); await this.endofday.click(); }
  async clickImportOrders() { await this.waitForLoader(); await this.importOrders.click(); }
  async clickErpSync() { await this.waitForLoader(); await this.erpSync.click(); }
  async clickMasterBOL() { await this.waitForLoader(); await this.masterBOL.click(); }
  async clickBatchShipId() {
    await this.waitForLoader();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.batchShipId.click()
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }
  async clickShippingDocuments() {
    await this.waitForLoader();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.shippingDocuments.click()
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }
  async clickUploadDocuments() {
    await this.waitForLoader();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.uploadDocuments.click()
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async logout() {
    await this.profileDropdownToggle.click();
    await this.logoutLink.click();
  }
}
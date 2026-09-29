
// This is the shippingPage.js Code which is under the pages_objects



export class ShippingPage {
  constructor(page) {
    this.page = page;

    this.deliverysearchfield = page.locator('#deliveryIDID');
    this.deliverysearchbtn = page.locator('#GoButtonID');
    this.printerName= page.locator('#labelPrinterNameSelectID:visible');
    this.shipbutton = page.locator('#AascButtonShipEnableId:visible');
    this.successMessage= page.locator('#displayMessage1Id:visible');
    this.clickToViewLabel = page.locator('//button[text()="View Label"]'); 
    this.voidbutton=page.locator('#AascButtonVoidEnableId');
    this.more=page.locator('#more:visible');
    //=========================================ShipTo Address Details ========================================================================
    this.addressEditbtn = page.locator('#shipToToggleBtnId');
    this.addressclosebtn = page.locator('//button[@onclick="showShipToAddrDetails();"]');
    this.customerName = page.locator('#shipToCompanyNameID');
    // this.shipTo = page.locator('#shipToLocation');
     this.line1 = page.locator('#shipToAddressLine1ID');
     this.line2 = page.locator('#shipToAddressLine2and3ID');
     this.line3= page.locator('#txtShipToAddressLine3');
     this.city = page.locator('#shipToAddressCityID');
     this.state = page.locator('#shipToAddressStateID');
     this.postalcode = page.locator('#shipToAddressPostalID');
     this.country = page.locator('#shipToAddressCountryID');
     this.phoneNumber = page.locator('#PhoneNumberText:visible');
     this.contactName=page.locator('#ContactNameText:visible');
    //========================================Carrier Details ==========================================================================   
    this.shipmethodlov = page.locator('#shipMethodID:visible');
    this.dropofftypebtn = page.locator('#DropoffandPackagingId:visible');
    this.dropOffTypeLov=page.locator('#dropOfTypeID:visible');
    this.packagingLov=page.locator('#packageListID:visible');
    this.dropoffClose = page.locator('//div[@class="modal fade DropoffandPackaging in"]//button[@id="closes"]');
    this.carrierPayMethod = page.locator('#CarrierPayMethodTextID');
    this.upsModal= page.locator('#tpDetailsButtonEnableID');
    //this.upsModal = page.locator('//*[@name="aascUpsPayMethodForm"]');
    this.upsModalSaveButton = page.locator('#save');
    this.dhlModalSaveButton = page.locator('#tpSaveButtonID');
    this.carrierAccountNumber = page.locator('#CarrierACNumberText');
    this.addtionalinfo = page.locator('#shipAddInfoTextAreaID');
    this.reference1 = page.locator('#RefOneText');
    this.reference2 = page.locator('#RefTwoText');
    this.department=page.locator('#deptText');
    this.shipmentDate=page.locator('#ShipDateTextBoxID');
    this.calendarMonthYear = page.locator('.datetimepicker-dropdown-bottom-right .datetimepicker-days .switch');
    this.calendarMonths = page.locator('.datetimepicker-dropdown-bottom-right .datetimepicker-months .switch');
    this.calendarYears = page.locator('.datetimepicker-dropdown-bottom-right .datetimepicker-years .switch');
    this.leftArrow = page.locator('.datetimepicker-years th.prev');
    this.rightArrow = page.locator('.datetimepicker-years th.next');
    this.yearDisplay = page.locator('.datetimepicker-years span.year');
    this.monthDisplay = page.locator('.datetimepicker-months span.month');
    this.dayDisplay = page.locator('td.day:not(.old):not(.new)');
    this.hourDisplay = page.locator('.datetimepicker-hours span.hour');
    this.minuteDisplay = page.locator('.datetimepicker-minutes span.minute');
    this.saturdayShipmentPickup = page.locator('#chkSatPickShipment123');
    //=======================================Frieght_Details=========================================    
    this.waybillNumber=page.locator('#waybillTextBoxID');
    //this.waybillNumber=page.locator('trackingNumberID1');
    this.BolNumber = page.locator('#bolNumberTextBoxID');
    this.shipmentCost = page.locator('#ShipCostTextBoxID');
    this.FrieghtChargers = page.locator('#ShipFreightTextBoxID');
    this.EstimatedFrienght = page.locator('#ratesFromFreightShopId');
    this.shipmentDeclarevalue = page.locator('#ShipmentDeclaredValueID');
    this.totalWeight = page.locator ('#totalWeightText');
    this.shippingHandlingCharge = page.locator('#handlingChargeID');
    // =======================================Shipment_Lines======================================
    this.lot_and_Serial_btn = page.locator('#aascSerialID1');
    // ============================Package_Details==================================================
    this.weight = page.locator('#weightID1:visible');
    this.dimensionName= page.locator('#dimensionNameID1:visible');
    this.dimensionsLov = page.locator('#dimButtonID1:visible');
    this.numberOfPackagesText = page.locator('#txtPacCnt');
    this.packagesAddbtn = page.locator('#AddButton');
  }

  async enterdeliveryid(deliveryid) {
    await this.deliverysearchfield.fill(String(deliveryid));
  }

  async clickdeliverysearchbtn(deliveryId){
    await this.deliverysearchbtn.click();
    //await this.page.locator(`text=Shipment ${deliveryId}`).waitFor({ state: 'visible' }); // Wait for the shipment ID (which is the same as delivery ID) to appear on the page
  }


  async selectShipMethod(method) {
    await this.shipmethodlov.waitFor();
    await this.shipmethodlov.selectOption(method);
  }

  async clickonDropOffTypebtn(){
    await this.dropofftypebtn.click();
  }

   async selectDropOffType(dropOffType){
    await this.dropOffTypeLov.waitFor();
    await this.dropOffTypeLov.selectOption(dropOffType);
  }

   async selectPackaging(packagingType){
    await this.packagingLov.waitFor();
    await this.packagingLov.selectOption(packagingType);
  }


  async dropOffpopupClose(){
    await this.dropoffClose.click();
  }

 
  async selectpayMethod(payMethod){
    await this.carrierPayMethod.selectOption(payMethod );
  }

  async clickonUpsTPBModal(){
    await this.upsModal.click();
  }

  async upsTPBModalSave(){
    await this.upsModalSaveButton.waitFor();
    await this.upsModalSaveButton.click();
  }

  async dhlTPBModalSave(){
    await this.dhlModalSaveButton.waitFor();
    await this.dhlModalSaveButton.click();
  }

  async enterAccountNumber(AccountNumber){
    await this.carrierAccountNumber.press('Delete');
    await this.page.keyboard.type(String(AccountNumber), { delay: 100 });
  }

  async selectShipmentDate(targetDate) {
    const shipmentDate = new Date(targetDate);

  const targetDay = shipmentDate.getDate();
  const targetMonth = shipmentDate.toLocaleString('default', { month: 'short' }); // Apr
  const targetYear = shipmentDate.getFullYear();

  const hours = shipmentDate.getHours();
  const minutes = shipmentDate.getMinutes();

  await this.shipmentDate.click();

  // Open month view
  await this.calendarMonthYear.click();
  await this.calendarMonths.click();


  while (true) {
    const rangeText = await this.calendarYears.textContent();
    const [start, end] = rangeText.split('-').map(Number);

    if (targetYear >= start && targetYear <= end) break;

    await (targetYear > end? this.rightArrow.click(): this.leftArrow.click());

  }

 

  await this.yearDisplay.filter({hasText: String(targetYear)}).click();


  // Select MONTH
  await this.monthDisplay.filter({ hasText: targetMonth }).click();
  // Select DAY
  await this.dayDisplay.filter({ hasText: String(targetDay) }).first().click();

  await this.hourDisplay.filter({ hasText: String(hours) }).click();
  await this.minuteDisplay.filter({ hasText: String(minutes).padStart(2, '0') }).click();
  }

  async enterAddtionalInfo(){
    const text = "Random Info " + Math.floor(Math.random() * 100000);
    await this.addtionalinfo.fill(text);
  }

  async enterPhoneNumber() {
    const phone = String(Math.floor(Math.random() * 9000000000) + 1000000000);
    await this.phoneNumber.fill(phone);
  }

  async enterContactName(){
    await this.contactName.fill("Test Contact");
  }

  async enterWeight(weight) {
    await this.weight.fill(String(weight));
  }


 async openDimensionPopup() {
 
    await this.dimensionName.selectOption('Other');
 
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.dimensionsLov.click()
    ]);
      await newPage.waitForLoadState();
      this.dimensionPage= newPage;
 
      this.lengthField = this.dimensionPage.locator('#packageDimensionLenghtID');    
      this.widthField = this.dimensionPage.locator('#packageDimensionWidthID');      
      this.heightField = this.dimensionPage.locator('#packageDimensionHeightID');
      this.Units=this.dimensionPage.locator('#packageDimensionUnitsID');
      this.dimensionSaveBtn = this.dimensionPage.locator('#NewButton');
     
  }
 
  async enterDimensions(length, width, height) {
    await this.lengthField.fill(String(length));
    await this.widthField.fill(String(width));
    await this.heightField.fill(String(height));
  }
 
 
  async saveDimensions(){  
    await this.dimensionSaveBtn.click();
  }

  async clickShip() {
    await this.shipbutton.waitFor();
    await this.shipbutton.click();
  }


  async clickViewLabel() {
    await this.viewlabel.click();
  }

  async openLabelView() {
    await this.clickToViewLabel.click();
  }

  async clickMore(){  
    await this.more.waitFor();
    await this.more.click();
  }


 async getPdfTab() {
    // Clicking on the "View Label" on shipping page --> popup opens
    const [labelPopup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.viewlabel.click()
    ]);

    // In popup, click "View Label" → PDF tab opens
    const [pdfTab] = await Promise.all([
      labelPopup.waitForEvent('popup'),
      labelPopup.locator("//button[contains(., 'View Label')]").click()
    ]);

    return pdfTab; // give back the PDF tab
  }

  async voidShipment(){
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
    await this.voidbutton.click();
  }

  async addPackages(numberOfPackages){
    await this.numberOfPackagesText.fill(String(numberOfPackages));
    await this.packagesAddbtn.click();
  }

  async enterAddressLine1(){
    const text = "Random Info " + Math.floor(Math.random() * 100000);
    await this.line1.fill(text);
  }

  async enterAddressLine2(){
    const text = "Random Info " + Math.floor(Math.random() * 100000);
    await this.line2.fill(text);
  }

  async enterAddressLine3(){
    const text = "Random Info " + Math.floor(Math.random() * 100000);
    await this.line3.fill(text);
  }

  async selectPrinter(printerName){
    await this.printerName.selectOption(printerName);
  }


  //==============GET VALUES=================

  async editDestinationAddress(){
    await this.addressEditbtn.click();
  }

  async getCustomerName(){
    const customerName = await this.customerName.getAttribute('value');
    return customerName.trim();
  }
  
  // async getShipTovalue(){
  //   const value = await this.shipTo.textContent();
  //   return value.trim();
  // }

  async getAddressLine1(){
    const line1=await this.line1.getAttribute('value');
    return line1;
  }

  async getAddressLine2(){
    const line2=await this.line2.getAttribute('value');
    return line2;
  }

  async getAddressLine3(){
    const line3=await this.line3.getAttribute('value');
    return line3;
  }

  async getCityName (){
    const city = await this.city.getAttribute('value');
    return city;
  }

  async getStateName(){
    const state = await this.state.getAttribute('value');
    return state.trim();
  }

  async getPostalCode(){
    const postalcode = await this.postalcode.getAttribute('value');
    return postalcode.trim();
  }

  async getCountryName(){
    const country = await this.country.getAttribute('value');
    return country.trim();
  }

  async closeDestinationAddress(){
    await this.addressclosebtn.click();
  }

  async getPhoneNumber(){
    const phoneNumber = await this.phoneNumber.getAttribute('value');
    return phoneNumber.trim();
  }

  async getContactName(){
    const contactName = await this.contactName.getAttribute('value');
    return contactName.trim();
  }

  async getCarrierPayMethod() {
    return await this.carrierPayMethod.inputValue();
  }

  async getCarrierAccountNumber() {
    return await this.carrierAccountNumber.inputValue();
  }

  async getWeight() {
    const weight = await this.weight.getAttribute('value');
    return weight.trim();

  }

  async getReference1(){
    const reference1 = await this.reference1.getAttribute('value');
    return reference1.trim();
  }

  async getReference2(){
    const reference2 = await this.reference2.getAttribute('value');
    return reference2.trim();
  }

  async getMessage(){
    const message= await this.successMessage.textContent();
    return message.trim();
  }

  async getTrackingNumberByIndex(index){
    const value = await this.page.locator(`#trackingNumberID${index}`).getAttribute('value');
    return value;
  }

  async getDepartment(){
    const department = await this.department.getAttribute('value');
    return department.trim();
  }

  async getShipmentDate(){
    const shipmentDate = await this.shipmentDate.getAttribute('value');
    const date = new Date(shipmentDate.replace(' ', 'T'));

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = String(date.getFullYear()).slice(-2);

    return `${day}${month}${year}`;
  }

  async getDimensions(){
   const dimensions=await this.dimensionName.inputValue();
   const parts = dimensions.split('*').slice(0, 3);

  // 2. Remove trailing .0 if present
  const cleaned = parts.map(num => parseFloat(num).toString());

  // 3. Join with 'x'
  return cleaned.join('x');
  }




}

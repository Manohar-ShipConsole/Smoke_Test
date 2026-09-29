
exports.ShippingPage = class ShippingPage {
  constructor(page) {
    this.page = page;

    this.deliverysearchfield = page.locator('#deliveryIDID');
    this.deliverysearchbtn = page.locator('#GoButtonID');
    this.shipbutton = page.locator('#AascButtonShipEnableId');
    this.successMessage= page.locator('#displayMessage1Id');
    this.clickToViewLabel = page.locator('//button[text()="View Label"]'); 
    this.voidbutton=page.locator('#AascButtonVoidEnableId');
    //=========================================ShipTo Address Details ========================================================================
    this.customerName = page.locator('#shipToCompanyNameID');
    this.shipTo = page.locator('#shipToLocation');
    this.line1 = page.locator('#shipToAddressLine1ID');
    this.line2 = page.locator('#shipToAddressLine2and3ID');
    this.line3= page.locator('#txtShipToAddressLine3');
    this.city = page.locator('#shipToAddressCityID');
    this.state = page.locator('#shipToAddressStateID');
    this.postalcode = page.locator('#shipToAddressPostalID');
    this.country = page.locator('#shipToAddressCountryID');
    this.phoneNumber = page.locator('#PhoneNumberText');
    this.contactName=page.locator('#ContactNameText');
    this.recipientEmail=page.locator('#RecepientEmailText');
    //========================================Carrier Details ==========================================================================   
    this.shipmethodlov = page.locator('#shipMethodID');
    this.dropOffTypeLov=page.locator('#dropOfTypeID');
    this.packagingLov=page.locator('#packageListID');
    this.carrierPayMethod = page.locator('#CarrierPayMethodTextID');
    this.upsModal = page.locator('//*[@name="aascUpsPayMethodForm"]');
    this.upsModalSaveButton = page.locator('#save');
    this.carrierAccountNumber = page.locator('#CarrierACNumberText');
    this.addtionalinfo = page.locator('#shipAddInfoTextAreaID');
    this.reference1 = page.locator('#RefOneText');
    this.reference2 = page.locator('#RefTwoText');
    this.department=page.locator('#deptText');
    this.shipmentDate=page.locator('#ShipDateTextBoxID');
    this.saturdayShipmentPickup = page.locator('#chkSatPickShipment123');
    //=======================================Frieght_Details=========================================    
    this.waybillNumber=page.locator('#waybillTextBoxID');
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
    this.weight = page.locator('#weightID1');
    this.dimensionName= page.locator('#dimensionNameID1');
    this.dimensionsLov = page.locator('#dimButtonID1');
    this.numberOfPackagesText = page.locator('#txtPacCnt');
    this.packagesAddbtn = page.locator('#AddButton');
  }

  async enterdeliveryid(deliveryid) {
    await this.deliverysearchfield.fill(String(deliveryid));
  }

  async clickdeliverysearchbtn(deliveryId){
    await this.deliverysearchbtn.click();
    await this.page.locator(`text=Shipment ${deliveryId}`).waitFor({ state: 'visible' }); // Wait for the shipment ID (which is the same as delivery ID) to appear on the page
  }


  async selectShipMethod(method) {
    await this.shipmethodlov.waitFor();
    await this.shipmethodlov.selectOption(method);
  }

   async selectDropOffType(dropOffType){
    await this.dropOffTypeLov.waitFor();
    await this.dropOffTypeLov.selectOption(dropOffType);
  }

   async selectPackaging(packagingType){
    await this.packagingLov.waitFor();
    await this.packagingLov.selectOption(packagingType);
  }

 
  async selectpayMethod(payMethod){
    await this.carrierPayMethod.selectOption(payMethod );
  }

  async upsTPBModal(){
    console.log("UPS Third Party Billing modal opened.");
    await this.upsModalSaveButton.waitFor();
    await this.upsModalSaveButton.click();
  }

  async enterAccountNumber(AccountNumber){
    await this.carrierAccountNumber.press('Delete');
    await this.page.keyboard.type(String(AccountNumber), { delay: 100 });
  }

  async selectAccountNumber(AccountNumber){
    await this.carrierAccountNumber.waitFor();
    await this.carrierAccountNumber.selectOption(String(AccountNumber));
  }


  async enterAddtionalInfo(){
    const text = "Random Info " + Math.floor(Math.random() * 100000);
    await this.addtionalinfo.fill(text);
  }

  async enterPhoneNumber(phoneNumber){
    await this.phoneNumber.fill(String(phoneNumber));
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


 async getPdfTab() {
    // Step 1: Click "View Label" on shipping page → popup opens
    const [labelPopup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.viewlabel.click()
    ]);

    // Step 2: In popup, click "View Label" → PDF tab opens
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


  //==============GET VALUES=================

  async getCustomerName(){
    const customerName = await this.customerName.getAttribute('value');
    return customerName.trim();
  }
  
  async getShipTovalue(){
    const value = await this.shipTo.textContent();
    return value.trim();
  }

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

  async getDepartment(){
    const department = await this.department.getAttribute('value');
    return department.trim();
  }

  async getRecipientEmail(){
    const recipientEmail = await this.recipientEmail.getAttribute('value');
    return recipientEmail.trim();
  }

  async getShipmentDate(){
    const shipmentDate = await this.shipmentDate.getAttribute('value');
    const date = new Date(shipmentDate.replace(' ', 'T'));

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = String(date.getFullYear()).slice(-2);

    return `${day}${month}${year}`;
  }

  async getShipDate() {
    const shipmentDate = await this.shipmentDate.getAttribute('value');
    const date = new Date(shipmentDate.replace(' ', 'T'));

    const monthNumber = String(date.getMonth() + 1).padStart(2, '0');
    const dayNumber = String(date.getDate()).padStart(2, '0');
    const yearFull = date.getFullYear();
    return `${monthNumber}/${dayNumber}/${yearFull}`;

  }

  async getCIShipDate() {
    const shipmentDate = await this.shipmentDate.getAttribute('value');
    const date = new Date(shipmentDate.replace(' ', 'T'));

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = String(date.getFullYear()).slice(-2);

    return `${day} ${month}, ${year}`;

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

const fs = require('fs');
const path = require('path');
const { pdfToText } = require('../utils/pdfReader.js');
const { validateFiles } = require('../utils/validations.js');

exports.InternationalPage = class InternationalPage {

    constructor(page) {
        this.page = page;
        this.internationalPageLink = page.locator('#INTLlink');

    }

    async openInternationalPage() {

        await this.internationalPageLink.waitFor({ state: 'visible' });

        const [intlPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        this.internationalPageLink.click()
        ]);
        
        await intlPage.waitForLoadState();
        this.internationalPage = intlPage;


    this.commodity = this.internationalPage.locator("//select[@id='commodityLine']/option");


    this.commodityEditButton = this.internationalPage.locator('#fedexEditCommButtonID');
    this.commodityDeleteButton = this.internationalPage.locator('#fedexDelCommButtonID');
    this.productDescription = this.internationalPage.locator('//input[@name="description"]');
    this.numberOfPieces = this.internationalPage.locator('#fedexNumberOfPiecesID');
    this.harmonizedCode = this.internationalPage.locator('//input[@name="HarmonizedCode"]');
    this.quantity = this.internationalPage.locator('//input[@name="Quantity"]');
    this.exportLicenseNumber = this.internationalPage.locator('//input[@name="ExportLicenseNumber"]');
    // this.exportLicenseExpiryInput = this.internationalPage.locator('//*[@name="ExportLicenseExpirationDate"]');
    //this.exportLicenseExpirydate = this.internationalPage.locator('#ExportLicenseExpirationDate .input-group-addon');
    this.exportLicenseExpirydate = this.internationalPage.locator('input[name="ExportLicenseExpirationDate"]');
    this.CIDocument= this.internationalPage.locator('#viewCI');
    this.USCODocument= this.internationalPage.locator('#viewUSCO');

    this.calendar=this.internationalPage.locator(".datepicker-days");
    this.calendarDays=this.internationalPage.locator('//table//tbody//td[@class="day"]');
    this.customsValue = this.internationalPage.locator('//input[@name="CustomsValue"]');
    this.weight = this.internationalPage.locator('//*[@name="Weight"]');
    this.countryOfManufacture = this.internationalPage.getByLabel(/CountryOfManufacture/i);
    this.customsValue = this.internationalPage.locator('#fedexCustomsValueID');
   // this.unitOfMeasure = this.internationalPage.getByLabel(/Unit Of Measure/i);
    //this.saveCommodityItem = this.internationalPage.locator('#fedexAddOrEditItemID');
    this.calendarButton = this.internationalPage.locator(
      '#ExportLicenseExpirationDateID + button, #ExportLicenseExpirationDateID ~ button'
    );
    this.calendarHeader = this.internationalPage.locator('.datepicker-switch');
    this.nextMonthBtn = this.internationalPage.locator('.next');
    this.addCommodity = this.internationalPage.locator('//input[@name="addComm"]');
//===================================================================================
    this.billDutiesTo = this.internationalPage.getByLabel(/Bill duties\/taxes\/fees to/i);
    this.billingAccountNumber = this.internationalPage.getByLabel(/Account Number/i);
    this.billingcountry = this.internationalPage.getByLabel(/Country/i);

    this.billToDutiesAccountNumber = this.internationalPage.locator('#fedexIntlAccNumberID');

    this.termsOfSale = this.internationalPage.getByLabel(/Terms Of Sale/i);
    this.totalCustomsValue = this.internationalPage.getByLabel(/Total Customs Value/i);
    
    this.freightCharge = this.internationalPage.getByLabel(/Freight Charge/i);
    this.insuranceCharge = this.internationalPage.getByLabel(/Insurance Charge/i);
    this.taxesOrMiscCharge = this.internationalPage.getByLabel(/Taxes Or Miscellaneous Charge/i);
    this.purpose = this.internationalPage.getByLabel(/Purpose/i);
    this.relatedCompanies = this.internationalPage.getByLabel(/Related Companies/i);

    this.selectImporter = this.internationalPage.getByLabel(/Select Importer/i);
    this.importerName = this.internationalPage.getByLabel(/^Name\s*:/i);
    this.importerTaxId = this.internationalPage.getByLabel(/Importer Tax ID/i);
    this.companyName = this.internationalPage.getByLabel(/Company Name/i);
    this.importerTaxType = this.internationalPage.getByLabel(/Importer Tax Type/i);
    this.phoneNumber = this.internationalPage.getByLabel(/Phone Number/i);
    this.addressLine1 = this.internationalPage.getByLabel(/Address Line1/i);
    this.addressLine2 = this.internationalPage.getByLabel(/Address Line2/i);
    this.city = this.internationalPage.getByLabel(/^City/i);
    this.state = this.internationalPage.getByLabel(/^State/i);
    this.postalCode = this.internationalPage.getByLabel(/Postal/i);
    this.country = this.internationalPage.getByLabel(/^Country/i);
    this.saveImporterDetails = this.internationalPage.getByLabel(/Save\/update this Importer Detail/i);
    this.senderTaxId = this.internationalPage.getByLabel(/Sender Tax ID/i);
    this.senderTaxType = this.internationalPage.getByLabel(/Sender Tax Type/i);
    this.recipientTaxId = this.internationalPage.getByLabel(/Recipient Tax ID/i);
    this.recipientTaxType = this.internationalPage.getByLabel(/Recipient Tax Type/i);
    this.itnNumber = this.internationalPage.getByLabel(/ITN Number/i);
    this.getItnButton = this.internationalPage.getByRole('button', { name: /Get ITN/i });
    this.ftrExemptionNumber = this.internationalPage.getByLabel(/FTR Exemption Number /i);

    this.brokerCity=this.internationalPage.locator('#fedexBrokerCityID');
    this.brokerState=this.internationalPage.locator('#fedexBrokerStateID');
    this.brokerPincode=this.internationalPage.locator('#fedexBrokerPostalCodeID');
    this.brokerCountry=this.internationalPage.locator('#fedexBrokerCountryCodeID');


    this.datePickerDropdown=this.internationalPage.locator('.datepicker-dropdown');
    this.allDates=this.internationalPage.locator('.datepicker-days td.day:not(.old):not(.new)');
    

    this.internationalpageSave = this.internationalPage.locator('//button[@value=" Save "]');
    this.internationalpageclose = this.internationalPage.locator('//button[@id="fedexIntlTopCloseButtonEnableID"]');
    }


     async clickOnCommodity() {
       
        const commodityCount = await this.commodity.all();
    
        for (let i = 3; i < commodityCount.length; i++) {
          await commodityCount[i].click();
          await this.commodityDeleteButton.click();
        }
    
    
        if (commodityCount.length > 2) {
          await commodityCount[2].click();
        }
    
      }
    
      async clickEditCommodity() {
        await this.commodityEditButton.waitFor({ state: 'visible' });
        await this.commodityEditButton.click();
      }
    
      async saveCommodity() {
        await this.addCommodity.waitFor({ state: 'visible' });
        await this.addCommodity.click();
      }
    

      async selectTomorrowExportLicenseDate() {

    
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
    
      const targetDay = tomorrow.getDate().toString();
    
      console.log("Tomorrow Day =", targetDay);
    
       await this.page.waitForTimeout(2000);
      // Open calendar
      await this.exportLicenseExpirydate.click();

      //console.log("calender opened");
    
      // Wait calendar visible
      //await this.page.waitForSelector(".datepicker-days");
    
      await this.datePickerDropdown.waitFor({ state: 'visible' });
    
      // Get only valid days (not old / new month)
      const days = await this.allDates.all();
    
      for (const day of days) {
    
        const text = (await day.textContent()).trim();
    
        if (text === targetDay) {
          await day.click();
          console.log("Clicked Tomorrow Date:", text);
          break;
    
          }       
        }       
      }

      async editCommodityForceUpdate({
        description,
        countryOfManufacture,
        hsCode,
        quantity,
        unit,
        weight,
        customsValue,
        licenseNumber
      }) {
    
        await this.clickEditCommodity();
    
        if (description) {
          await this.productDescription.fill(String(description));
        }
    
        if (countryOfManufacture) {
          await this.countryOfManufacture.selectOption({ label: countryOfManufacture });
        }
    
        if (hsCode) {
          await this.harmonizedCode.fill(String(hsCode));
        }
    
        if (quantity) {
          await this.quantity.fill(String(quantity));
        }
    
        // if (unit) {
        //   await this.unitOfMeasure.selectOption({ label: unit });
        // }
    
        if (weight) {
          await this.weight.fill(String(weight));
        }
    
        if (customsValue) {
          await this.customsValue.fill(String(customsValue));
        }
    
        if (licenseNumber) {
          await this.exportLicenseNumber.fill(String(licenseNumber));
        }
    
         await this.selectTomorrowExportLicenseDate();
    
      }

        // await this.saveCommodity();
    
      async addCommodityitem(){
        await this.addCommodity.click();
    
      }

      async getDescription(){
        return await this.productDescription.inputValue();
      }

      async getNumberOfPieces(){
        return await this.numberOfPieces.inputValue();
      }

      async getHarmonizedCode(){
        return await this.harmonizedCode.inputValue();
      }

      async getQuantity(){
        return await this.quantity.inputValue();
      }

      async getWeight(){
        return await this.weight.inputValue();
      }

      async getCustomsValue(){
        return await this.customsValue.inputValue();
      }

      async enterBillToDutiesAccountNumber(accountNumber){
        await this.billToDutiesAccountNumber.fill(String(accountNumber));
      }

      async enterBrokerCountry(countryCode){
        await this.brokerPincode.fill("L9H 0C5");
        await this.brokerCity.fill("Waterdown");
        await this.brokerState.fill("ON");
        await this.brokerCountry.fill(String(countryCode));
      }



    // //  BILLING DETAILS
    
    
    async getBillDutiesTo() {
      return await this.billDutiesTo.inputValue();
    }
    
    async getBillingAccountNumber() {
      return await this.billingAccountNumber.inputValue();
    }
    
    async getBillingCountry() {
      return await this.billingcountry.inputValue();
    }


    
    // //  COMMERCIAL INVOICE
    
    
    // async setTermsOfSale(terms) {
    //   await this.termsOfSale.selectOption({ label: terms });
    // }
    
    // async setTotalCustomsValue(value) {
    //   await this.totalCustomsValue.fill(String(value));
    // }
    
    // async setFreightCharge(value) {
    //   await this.freightCharge.fill(String(value));
    // }
    
    // async setInsuranceCharge(value) {
    //   await this.insuranceCharge.fill(String(value));
    // }
    
    // async setTaxesOrMiscCharge(value) {
    //   await this.taxesOrMiscCharge.fill(String(value));
    // }
    
    // async setPurpose(purpose) {
    //   await this.purpose.selectOption({ label: purpose });
    // }

    async getTermsOfSale() { 
      return await this.termsOfSale.inputValue();
    }

    async getPurpose() {
      return await this.purpose.inputValue();
    }

      
    
    
    async getImporterName() {
      return await this.importerName.inputValue();
    }
    
    async getImporterCompanyName() {
      return await this.companyName.inputValue();
    }
    
    async getImporterPhone() {
      return await this.phoneNumber.inputValue();
    }
    
    async getImporterAddressLine1() {
      return await this.addressLine1.inputValue();
    }
    
    async getImporterAddressLine2() {
      return await this.addressLine2.inputValue();
    }
    
    async getImporterCity() {
      return await this.city.inputValue();
    }
    
    async getImporterState() {
      return await this.state.inputValue();
    }
    
    async getImporterPostalCode() {
      return await this.postalCode.inputValue();
    }
    
    async getImporterCountry() {
      return await this.country.inputValue();
    }
    
    
    // // EIN / TAX ID DETAILS
    
    
    // async setSenderTaxId(value) {
    //   await this.senderTaxId.fill(String(value));
    // }
    
    // async setSenderTaxType(type) {
    //   await this.senderTaxType.selectOption({ label: type });
    // }
    
    // async setRecipientTaxId(value) {
    //   await this.recipientTaxId.fill(String(value));
    // }
    
    // async setRecipientTaxType(type) {
    //   await this.recipientTaxType.selectOption({ label: type });
    // }
    
    
    // //  ELECTRONIC EXPORT INFO
    
    // async setITNNumber(itn) {
    //   await this.itnNumber.fill(String(itn));
    // }
    
    // async clickGetITN() {
    //   await this.getItnButton.click();
    // }
    
    // async setFTRExemptionNumber(value) {
    //   await this.ftrExemptionNumber.fill(String(value));
    // }
    
     async intlPagesave(){
        //await this.internationalpageSave.waitFor();
        await this.page.waitForTimeout(3000);
        await this.internationalpageSave.click();
      }
    
      async intlpageclose(){
    
        await this.page.waitForTimeout(3000);
    
        await this.internationalpageclose.click();
      }
    
    
      async viewCIDocument(testInfo,row){

        if(await this.CIDocument.isEnabled()){

        const [CIdoc] = await Promise.all([
          this.page.context().waitForEvent('page'),
          this.CIDocument.click()
        ]);
    
        let downloadedFiles=[];
        const pdfUrl = CIdoc.url();
    
        const labelName = new URL(pdfUrl).searchParams.get("commercialInvValue");
        await CIdoc.waitForLoadState('networkidle'); 
    
        const response = await this.page.context().request.get(pdfUrl);
    
         const outDir = path.resolve(process.cwd(), 'downloads');
         if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
        
        if(labelName==='CI'){
          const pdfContent = await response.body();
          const pdfPath= path.join(outDir, `${labelName}.pdf`);
          const txtPath = path.join(outDir, `${labelName}.txt`);
          const extractedText = await pdfToText(pdfContent);
          fs.writeFileSync(pdfPath, pdfContent);
          fs.writeFileSync(txtPath, extractedText);
          downloadedFiles.push(pdfPath, txtPath);
          await testInfo.attach(`${labelName}.pdf`, {
              path: pdfPath,
          });
          await testInfo.attach(`${labelName}.txt`, {
              path: txtPath,
          });
          //await validateFiles(this.page,row,extractedText,labelName);
        }
      await CIdoc.close();
        }
        
      }
      
    
      async viewUSCODocument(testInfo,row){  

        if(await this.USCODocument.isEnabled()){
         const [USCOdoc] = await Promise.all([
          this.page.context().waitForEvent('page'),
          this.USCODocument.click()
        ]);
        let downloadedFiles=[];
    
        
        const pdfUrl = USCOdoc.url();
    
        const labelName = new URL(pdfUrl).searchParams.get("uscoviewValue");
        await USCOdoc.waitForLoadState('networkidle'); 
    
        const response = await this.page.context().request.get(pdfUrl);
    
         const outDir = path.resolve(process.cwd(), 'downloads');
         if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
        
        if(labelName==='USCO'){
          const pdfContent = await response.body();
          const pdfPath= path.join(outDir, `${labelName}.pdf`);
          const txtPath = path.join(outDir, `${labelName}.txt`);
          const extractedText = await pdfToText(pdfContent);
          fs.writeFileSync(pdfPath, pdfContent);
          fs.writeFileSync(txtPath, extractedText);
          downloadedFiles.push(pdfPath, txtPath);
          await testInfo.attach(`${labelName}.pdf`, {
              path: pdfPath,
          });
          await testInfo.attach(`${labelName}.txt`, {
              path: txtPath,
          });
          //await validateFiles(this.page,row,extractedText,labelName);

        }
      await USCOdoc.close();
        
      }
    }


}




// This is the InternationalPage.js Code which is under the pages_objects

// const fs = require('fs');
// const path = require('path');
// const { pdfToText } = require('../utils/pdfReader.js');

import fs from 'fs';
import path from 'path';
import { pdfToText } from '../utils/pdfReader.js';
import { validateFiles } from '../utils/validations.js';

export class InternationalPage {

    constructor(page) {
        this.page = page;
        this.internationalPageLink = page.locator('//label[@onclick="openIntPopUp()"]');

    }

    async openInternationalPage() {

        await this.internationalPageLink.waitFor();

        const [intlPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        this.internationalPageLink.click()
        ]);
        
        await intlPage.waitForLoadState();
        this.internationalPage = intlPage;


    this.commodity = this.internationalPage.locator("//select[@id='commodityLine']/option");
    this.commodityEditButton = this.internationalPage.locator("//button[contains(text(),'Edit Item')]");
    this.commodityDeleteButton = this.internationalPage.locator('//button[@name="delComm"]');
    this.productDescription = this.internationalPage.locator('//input[@name="description"]');
    this.harmonizedCode = this.internationalPage.locator('//input[@name="HarmonizedCode"]');
    this.quantity = this.internationalPage.locator('//input[@name="Quantity"]');
    this.exportLicenseNumber = this.internationalPage.locator('//input[@name="ExportLicenseNumber"]');
    this.exportLicenseExpirydate = this.internationalPage.locator('input[name="ExportLicenseExpirationDate"]');
    this.CIDocument= this.internationalPage.locator('#viewCI,#upsIntlViewPrintButtonEnableID, #dhlIntlViewPrintButtonEnableID');
    this.USCODocument= this.internationalPage.locator('#viewUSCO');
    this.calendar=this.internationalPage.locator(".datepicker-days");
    this.calendarDays=this.internationalPage.locator('//table//tbody//td[@class="day"]');
    this.customsValue = this.internationalPage.locator('//input[@name="CustomsValue"]');
    this.countryOfManufacture = this.internationalPage.locator('//select[@name="CountryOfManufacture"]');
    this.unitOfMeasure = this.internationalPage.locator('//select[@name="QuantityUnits"]');
    this.calendarButton = this.internationalPage.locator(
      '#ExportLicenseExpirationDateID + button, #ExportLicenseExpirationDateID ~ button'
    );
    this.calendarHeader = this.internationalPage.locator('.datepicker-switch');
    this.nextMonthBtn = this.internationalPage.locator('.next');
    this.addCommodity = this.internationalPage.locator('//input[@name="addComm"]');
//===================================================================================
    this.billDutiesTo = this.internationalPage.locator('//select[@name="payerType"]');
    this.billingAccountNumber = this.internationalPage.locator('//input[@name="AccNumber"]');
    this.billingcountry = this.internationalPage.locator('//select[@name="countryCode"]');

    this.termsOfSale = this.internationalPage.locator('//select[@name="TermsOfSale"]');
    this.freightCharge = this.internationalPage.locator('//input[starts-with(@name,"FreightCharge")]');
    this.insuranceCharge = this.internationalPage.locator('//input[starts-with(@name,"InsuranceCharge")]');
    this.taxesOrMiscCharge = this.internationalPage.locator('//input[@name="TaxesOrMiscellaneousCharge"]');
    this.purpose = this.internationalPage.locator('//Select[@name="Purpose"]');
    this.relatedCompanies = this.internationalPage.locator('//select[@name="PartiestoTransaction"]');

    this.importerdetailsSection = this.internationalPage.locator('//*[contains(text(),"Importer Details")]');
    //this.selectImporter = this.internationalPage.getByLabel(/Select Importer/i);
    this.importerName = this.internationalPage.locator('//input[@name="importerName"]');
   // this.importerTaxId = this.internationalPage.getByLabel(/Importer Tax ID/i);
    this.companyName = this.internationalPage.locator('//input[@name="importerCompName"]');
    //this.importerTaxType = this.internationalPage.getByLabel(/Importer Tax Type/i);
    this.phoneNumber = this.internationalPage.locator('//input[@name="importerPhoneNum"]');
    this.addressLine1 = this.internationalPage.locator('//input[@name="importerAddress1"]');
    this.addressLine2 = this.internationalPage.locator('//input[@name="importerAddress2"]');
    this.city = this.internationalPage.locator('//input[@name="importerCity"]');
    this.state = this.internationalPage.locator('//input[@name="importerState"]');
    this.postalCode = this.internationalPage.locator('//input[@name="importerPostalCode"]');
    this.country = this.internationalPage.locator('//input[@name="importerCountryCode"]');
    this.carrierName=this.internationalPage.locator('#UExportingCarrierID');


    //this.saveImporterDetails = this.internationalPage.getByLabel(/Save\/update this Importer Detail/i);
    this.senderTaxId = this.internationalPage.getByLabel(/Sender Tax ID/i);
    this.senderTaxType = this.internationalPage.getByLabel(/Sender Tax Type/i);
    this.recipientTaxId = this.internationalPage.getByLabel(/Recipient Tax ID/i);
    this.recipientTaxType = this.internationalPage.getByLabel(/Recipient Tax Type/i);
    this.itnNumber = this.internationalPage.getByLabel(/ITN Number/i);
    this.getItnButton = this.internationalPage.getByRole('button', { name: /Get ITN/i });
    this.ftrExemptionNumber = this.internationalPage.getByLabel(/FTR Exemption Number /i);
    this.datePickerDropdown=this.internationalPage.locator('.datepicker-dropdown');
    this.allDates=this.internationalPage.locator('.datepicker-days td.day:not(.old):not(.new)');
    this.numberOfPieces = this.internationalPage.locator('//input[@name="NumberOfPieces"]');
    this.commodityWeight = this.internationalPage.locator('//input[@name="Weight"]');
    this.internationalpageSave = this.internationalPage.locator('#fedexIntlTopSaveButtonEnableID, #upsIntlTopSaveButtonEnableID, #saveId1');
    this.internationalpageClose = this.internationalPage.locator(
  '#fedexIntlTopCloseButtonEnableID, #upsIntlTopCloseButtonEnableID, #dhlIntlTopCloseButtonEnableID, #closeId'
);
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
        
        if (!(await this.exportLicenseExpirydate.isVisible().catch(() => false))) {
    console.log("Export License Date not available → skipping");
    return;
  }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const targetDay = tomorrow.getDate().toString();
      console.log("Tomorrow Day =", targetDay);
      //  await this.page.waitForTimeout(2000);
      // Open calendar
      await this.exportLicenseExpirydate.click();
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
        if (unit) {
          await this.unitOfMeasure.selectOption({ label: unit });
        }
        // if (customsValue) {
        //   await this.customsValue.fill(String(customsValue));
        // }

        if (customsValue) {
  try {
    await this.customsValue.waitFor({ state: 'visible', timeout: 2000 });
    await this.customsValue.fill(String(customsValue));
  } catch {
    console.log("Customs Value not available → skipping (UPS case)");
  }
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
    //  BILLING DETAILS
     async getBillDutiesTo() {
      const value = await this.billDutiesTo.inputValue();
      return value;
    }
    async getBillingAccountNumber() {
     const accountnum= await this.billingAccountNumber.inputValue();
     return accountnum;
     }
    // async getBillingCountry() {
    //   return await this.billingcountry.inputValue();
    // }
    
    // //  COMMERCIAL INVOICE
    async setTermsOfSale(terms) {
      await this.termsOfSale.selectOption({ label: terms });
    }


    async enterCarrierName(){
      await this.carrierName.fill("UPS");
    }

    //===================================================================================================================

     // This below Code Works when Drop down values has Sepcial characters --> will remove this code later --> if not usefull in future



//     async setTermsOfSale(terms) {

//   // Extract EXW from "Ex Works(EXW)"
//   const match = terms.match(/\((.*?)\)/);
//   const value = match ? match[1] : terms;

//   await this.termsOfSale.evaluate((el, val) => {
//     el.value = val;

//     // Trigger events (VERY IMPORTANT)
//     el.dispatchEvent(new Event('change', { bubbles: true }));
//     el.dispatchEvent(new Event('input', { bubbles: true }));
//   }, value);

//   const selected = await this.termsOfSale.inputValue();
//   console.log("Selected Terms Of Sale:", selected);
// }




//==============================================================================================================================
    
     async setFreightCharge(value) {
      await this.freightCharge.fill(String(value));
    }
    
     async setInsuranceCharge(value) {
       await this.insuranceCharge.fill(String(value));
     }
    
    //  async setTaxesOrMiscCharge(value) {
    //    await this.taxesOrMiscCharge.fill(String(value));
    //  }

    async setTaxesOrMiscCharge(value) {
  if (value && await this.taxesOrMiscCharge.isVisible().catch(() => false)) {
    await this.taxesOrMiscCharge.fill(String(value));
  } else {
    console.log("Taxes/Misc Charge not available → skipping (UPS case)");
  }
}
    
     async setPurpose(purpose) {
       await this.purpose.selectOption({ label: purpose });
     }

     async setRelatedCompanies(relatedCompanies){
      await this.relatedCompanies.selectOption({label: relatedCompanies})
     }
    

     async importerdetails(){
       return await this.importerdetailsSection.isVisible().catch(() => false);
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
    
    // async getImporterAddressLine2() {
    //   return await this.addressLine2.inputValue();
    // }
    
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

    async getImporterAddressLine2() {
      return await this.addressLine2.inputValue();
    }

    async getDescription() {
      return await this.productDescription.inputValue();
    }

    async getHarmonizedCode() {
      return await this.harmonizedCode.inputValue();
    }

    async getQuantity() {
      return await this.quantity.inputValue();
    }

    async getCustomsValue() {
      return await this.customsValue.inputValue();
    }

    async getNumberOfPieces() {
      return await this.numberOfPieces.inputValue();
    }

    async getWeight() {
      return await this.commodityWeight.inputValue();
    }

    async getTermsOfSale() {
      return await this.termsOfSale.inputValue();
    }

    async getPurpose() {
     
        return await this.purpose.inputValue({ timeout: 3000 });
      
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
         await this.internationalpageSave.first().click();
      }
    
      async intlpageclose(){

        await this.internationalpageClose.first().click();
        
      }
      async viewCIDocument(testInfo, labelName, row, page){

        console.log("Validating Commercial Invoice PDF");

        if(await this.CIDocument.isEnabled()){

        const [CIdoc] = await Promise.all([
          this.page.context().waitForEvent('page'),
          this.CIDocument.click()
        ]);

        let downloadedFiles=[];
        const pdfUrl = CIdoc.url();

        await CIdoc.waitForLoadState('networkidle');

        const response = await this.page.context().request.get(pdfUrl);

         const outDir = path.resolve(process.cwd(), 'downloads');
         if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

        if(pdfUrl){
          const pdfContent = await response.body();
          const pdfPath= path.join(outDir, `CI_${labelName}.pdf`);
          const txtPath = path.join(outDir, `CI_${labelName}.txt`);
          const extractedText = await pdfToText(pdfContent);
          fs.writeFileSync(pdfPath, pdfContent);
          fs.writeFileSync(txtPath, extractedText);
          downloadedFiles.push(pdfPath, txtPath);
          await testInfo.attach(`CI_${labelName}.pdf`, {
              path: pdfPath,
          });
          await testInfo.attach(`CI_${labelName}.txt`, {
              path: txtPath,
          });
          await validateFiles(page, row, extractedText, `CI_${labelName}`, this);
        }
      await CIdoc.close();
      console.log("Validated Commercial Invoice PDF");
        }

      }
      
    
      async viewUSCODocument(testInfo, labelName, row, page){
        console.log("Validating USCO Document");

        if(await this.USCODocument.isEnabled()){
         const [USCOdoc] = await Promise.all([
          this.page.context().waitForEvent('page'),
          this.USCODocument.click()
        ]);
        let downloadedFiles=[];

        const pdfUrl = USCOdoc.url();
        await USCOdoc.waitForLoadState('networkidle');

        const response = await this.page.context().request.get(pdfUrl);

         const outDir = path.resolve(process.cwd(), 'downloads');
         if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

        if(pdfUrl){
          const pdfContent = await response.body();
          const pdfPath= path.join(outDir, `USCO_${labelName}.pdf`);
          const txtPath = path.join(outDir, `USCO_${labelName}.txt`);
          const extractedText = await pdfToText(pdfContent);
          fs.writeFileSync(pdfPath, pdfContent);
          fs.writeFileSync(txtPath, extractedText);
          downloadedFiles.push(pdfPath, txtPath);
          await testInfo.attach(`USCO_${labelName}.pdf`, {
              path: pdfPath,
          });
          await testInfo.attach(`USCO_${labelName}.txt`, {
              path: txtPath,
          });
          await validateFiles(page, row, extractedText, `USCO_${labelName}`, this);
        }
      await USCOdoc.close();
      console.log("Validated USCO Document");

      }
    }


}


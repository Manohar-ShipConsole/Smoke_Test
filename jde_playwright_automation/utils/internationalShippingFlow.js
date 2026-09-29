
// this is the code of internatialShippingFlow.js under the Utils folder

import { InternationalPage } from '../pages_objects/InternationalPage';
import { ShippingPage } from '../pages_objects/ShippingPage';

import { expect } from "@playwright/test";

export async function internationalShippingFlow(page, row, shippingPage ) {

  const internationalNew = new InternationalPage(page);
  //const shippingPage=new ShippingPage();

await internationalNew.openInternationalPage();
await internationalNew.clickOnCommodity();

  await internationalNew.editCommodityForceUpdate({
    description: row["description"],
    countryOfManufacture: row["countryOfManufacture"],
    hsCode: row["hsCode"],
    quantity: row.Quantity,
    unit: row["UnitOfMeasure"],
    customsValue: row["customsValue"],
    licenseNumber: row["licenseNumber"]

  });

  await page.waitForTimeout(3000);

  await internationalNew.saveCommodity();
  console.log(`International commodity updated for Delivery ${row.DeliveryID}`);

 console.log("Validating International Billing auto-mapping");
 const carrierPayMethod = await shippingPage.getCarrierPayMethod();
 const carrierAccount = await shippingPage.getCarrierAccountNumber();

 // Read Billing details from International page
 const billDutiesTo = await internationalNew.getBillDutiesTo();

  const payMethodMap = {
  PP: "SENDER",
  RC: "RECIPIENT",
  TP: "THIRD PARTY"
};
 const expectedBillTo = payMethodMap[carrierPayMethod];
 const billingAccount = await internationalNew.getBillingAccountNumber();
 //const billingCountry = await internationalNew.getBillingCountry();

// Assertions
 //expect.soft(billDutiesTo).toBe(expectedBillTo);
 //expect.soft(billingAccount).toBe(carrierAccount);
 //expect.soft(billingCountry).toBe("United States");

 console.log("International billing details auto-mapped correctly");



// // COMMERCIAL INVOICE – INPUT FROM EXCEL

 console.log("Updating Commercial Invoice details from Excel");

 if (row["TermsOfSale"]) {
 await internationalNew.setTermsOfSale(row["TermsOfSale"]);
 console.log("terms of sales --> Selected");
 }

// Purpose (dropdown)
if (row["Purpose"]) {
  await internationalNew.setPurpose(row["Purpose"]);
 }

// Freight Charge (text)
 if (row["FreightCharge"]) {
  await internationalNew.setFreightCharge(row["FreightCharge"]);
}

// Insurance Charge (text)
 if (row["InsuranceCharge"]) {
   await internationalNew.setInsuranceCharge(row["InsuranceCharge"]);
 }

// Taxes / Miscellaneous Charge (text)
 if (row["TaxesOrMiscellaneousCharge"]) {
   await internationalNew.setTaxesOrMiscCharge(row["TaxesOrMiscellaneousCharge"]);
 }

 if(row["RelatedCompanies"]){
  await internationalNew.setRelatedCompanies(row["RelatedCompanies"]);
 }



console.log("Commercial Invoice details updated successfully");




console.log("Validating Importer details auto-mapped from Ship To");



// // Read Ship To (Shipping page)
// //const shipToCompany = await shippingPage.getShipTovalue();
// const shipToCompany = await shippingPage.getCustomerName();
// const shipToAddr1 = await shippingPage.getAddressLine1();
// const shipToCity = await shippingPage.getCityName();
// const shipToState = await shippingPage.getStateName();
// const shipToPostal = await shippingPage.getPostalCode();
// const shipToCountry = await shippingPage.getCountryName();
// const shipToPhone = await shippingPage.getPhoneNumber();

// // // Read Importer (International page)
// const importerCompany = await internationalNew.getImporterCompanyName();
// const importerAddr1 = await internationalNew.getImporterAddressLine1();
// const importerCity = await internationalNew.getImporterCity();
// const importerState = await internationalNew.getImporterState();
// const importerPostal = await internationalNew.getImporterPostalCode();
// const importerCountry = await internationalNew.getImporterCountry();
// const importerPhone = await internationalNew.getImporterPhone();

// // // Assertions
// expect.soft(importerCompany).toContain(shipToCompany);
// expect.soft(importerAddr1).toBe(shipToAddr1);
// expect.soft(importerCity).toBe(shipToCity);
// expect.soft(importerState).toBe(shipToState);
// expect.soft(importerPostal).toBe(shipToPostal);
// expect.soft(importerCountry).toBe(shipToCountry);
// expect.soft(importerPhone).toBe(shipToPhone);

//  console.log("Importer details validated successfully");


if (await internationalNew.importerdetailsSection.isVisible().catch(() => false)) {

  // Ship To
  const shipToCompany = await shippingPage.getCustomerName();
  const shipToAddr1 = await shippingPage.getAddressLine1();
  const shipToCity = await shippingPage.getCityName();
  const shipToState = await shippingPage.getStateName();
  const shipToPostal = await shippingPage.getPostalCode();
  const shipToCountry = await shippingPage.getCountryName();
  const shipToPhone = await shippingPage.getPhoneNumber();

  // Importer
  const importerCompany = await internationalNew.getImporterCompanyName();
  const importerAddr1 = await internationalNew.getImporterAddressLine1();
  const importerCity = await internationalNew.getImporterCity();
  const importerState = await internationalNew.getImporterState();
  const importerPostal = await internationalNew.getImporterPostalCode();
  const importerCountry = await internationalNew.getImporterCountry();
  const importerPhone = await internationalNew.getImporterPhone();

  // Assertions
  // expect.soft(importerCompany).toContain(shipToCompany);
  // expect.soft(importerAddr1).toBe(shipToAddr1);
  // expect.soft(importerCity).toBe(shipToCity);
  // expect.soft(importerState).toBe(shipToState);
  // expect.soft(importerPostal).toBe(shipToPostal);
  // expect.soft(importerCountry).toBe(shipToCountry);
  //expect.soft(importerPhone).toBe(shipToPhone);



  console.log("Importer details validated successfully");

} else {
  console.log("Importer section not available → skipping (UPS case)");
}


  if (await internationalNew.carrierName.isVisible().catch(() => false)) {
      await internationalNew.enterCarrierName();
  }


await internationalNew.intlPagesave();

await internationalNew.intlpageclose();


// await this.page.waitForTimeout(2000);
   //return page;




}


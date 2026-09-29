import { InternationalPage } from "../pages_objects/InternationalPage";
import { expect } from "@playwright/test";


export async function internationalShippingFlow(page, row) {

  const internationalNew = new InternationalPage(page);

  await internationalNew.openInternationalPage();

  await internationalNew.clickOnCommodity();

  
  await internationalNew.editCommodityForceUpdate({
    description: row["description"],
    countryOfManufacture: row["countryOfManufacture"],
    hsCode: row["hsCode"],
    quantity: row.Quantity,
    //unit: row["unit"],
    weight: row.Weight,
    customsValue: row["customsValue"],
    licenseNumber: row["licenseNumber"]

  });


  await page.waitForTimeout(3000);

  await internationalNew.saveCommodity();

  

  console.log(`International commodity updated for Delivery ${row.DeliveryID}`);


//   console.log("Validating International Billing auto-mapping");

//   // Read values from Shipping page
//   const carrierPayMethod = await shippingPage.getCarrierPayMethod();
//   const carrierAccount = await shippingPage.getCarrierAccountNumber();

//   // Read Billing details from International page
//   const billDutiesTo = await international.getBillDutiesTo();
//   const billingAccount = await international.getBillingAccountNumber();
//   const billingCountry = await international.getBillingCountry();

//   // Assertions
//   expect.soft(billDutiesTo).toBe(carrierPayMethod);
//   expect.soft(billingAccount).toBe(carrierAccount);
//   expect.soft(billingCountry).toBe("United States");

//   console.log("International billing details auto-mapped correctly");



// // COMMERCIAL INVOICE – INPUT FROM EXCEL


// console.log("Updating Commercial Invoice details from Excel");

// // Terms Of Sale (dropdown)
// if (row["Terms Of Sale"]) {
//   await internationalNew.setTermsOfSale(row["Terms Of Sale"]);
// }

// // Purpose (dropdown)
// if (row["Purpose"]) {
//   await internationalNew.setPurpose(row["Purpose"]);
// }

// // Total Customs Value (text)
// if (row["Total Customs Value"]) {
//   await internationalNew.setTotalCustomsValue(row["Total Customs Value"]);
// }

// // Freight Charge (text)
// if (row["Freight Charge"]) {
//   await internationalNew.setFreightCharge(row["Freight Charge"]);
// }

// // Insurance Charge (text)
// if (row["Insurance Charge"]) {
//   await internationalNew.setInsuranceCharge(row["Insurance Charge"]);
// }

// // Taxes / Miscellaneous Charge (text)
// if (row["Taxes Or Miscellaneous Charge"]) {
//   await internationalNew.setTaxesOrMiscCharge(row["Taxes Or Miscellaneous Charge"]);
// }

// console.log("Commercial Invoice details updated successfully");




// console.log("Validating Importer details auto-mapped from Ship To");

// // Read Ship To (Shipping page)
// const shipToCompany = await shipping.getShipTovalue();
// const shipToAddr1 = await shipping.addressLine1();
// const shipToCity = await shipping.cityName();
// const shipToState = await shipping.stateName();
// const shipToPostal = await shipping.postalcode.getAttribute('value');
// const shipToCountry = await shipping.country.getAttribute('value');
// const shipToPhone = await shipping.phoneNumber.getAttribute('value');

// // Read Importer (International page)
// const importerCompany = await international.getImporterCompanyName();
// const importerAddr1 = await international.getImporterAddressLine1();
// const importerCity = await international.getImporterCity();
// const importerState = await international.getImporterState();
// const importerPostal = await international.getImporterPostalCode();
// const importerCountry = await international.getImporterCountry();
// const importerPhone = await international.getImporterPhone();

// // Assertions
// expect.soft(importerCompany).toContain(shipToCompany);
// expect.soft(importerAddr1).toBe(shipToAddr1);
// expect.soft(importerCity).toBe(shipToCity);
// expect.soft(importerState).toBe(shipToState);
// expect.soft(importerPostal).toBe(shipToPostal);
// expect.soft(importerCountry).toBe(shipToCountry);
// expect.soft(importerPhone).toBe(shipToPhone);

// console.log("Importer details validated successfully");

await internationalNew.enterBillToDutiesAccountNumber("740561073");
await internationalNew.enterBrokerCountry("CA");


await internationalNew.intlPagesave();

await internationalNew.intlpageclose();


// await this.page.waitForTimeout(2000);
   //return page;




}


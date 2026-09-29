
//this is the code of shipping.test.js under the tests

import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages_objects/LoginPage.js";
import { IndexPage } from "../pages_objects/IndexPage.js";
import { ShippingPage } from "../pages_objects/ShippingPage.js";
import { InternationalPage } from "../pages_objects/InternationalPage.js";
import { Documents } from "../pages_objects/Documents.js";
import {handlingPackageOptions, handlingMultiPackageHazmat} from "../utils/PackageOptionsFlow.js";
import { Consolidation } from "../pages_objects/Consolidation.js";
import { openLabelInNewTab } from "../utils/labelHandler.js";
import { internationalShippingFlow } from "../utils/internationalShippingFlow.js";
import { handleFreightDetails } from "../utils/freightDetailsFlow.js";
import { handleConsolidation } from "../utils/consolidationFlow.js";
import { readExcelSync } from "../utils/excelReader.js";

//import { extractPdfText } from "../utils/pdfReader.js";
import { checkQZPrint } from "../utils/qzReader.js";
import config from "../configuration/config.js";



const excelData = readExcelSync("ShippingData_EBS.xlsx", "Sheet1");

const runnableData = excelData.filter(
  row => row.RunFlag && row.RunFlag.toUpperCase() === 'Y'
);

// Errors here are logged, not thrown — a failed screenshot capture shouldn't fail the test itself.
// Re-confirms the message banner is still visible right before the shot, since the same banner
// element gets reused for later messages (Print, Void) and could otherwise be overwritten by then.
async function captureShipmentConfirmation(page, testInfo, label, messageLocator) {
  try {
    const fs = await import('fs');
    const path = await import('path');

    if (messageLocator) {
      await messageLocator.waitFor({ state: 'visible', timeout: 5000 });

    }
    const screenshot = await page.screenshot();


    // Save screenshot to file (required by pulse report plugin)
    const outDir = 'test-attachments';
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const filename = path.join(outDir, `shipment-confirmation-${label.replace(/\s+/g, '-')}-${Date.now()}.png`);
    fs.writeFileSync(filename, screenshot);

    await testInfo.attach(`Shipment Confirmation - ${label}`, {
      path: filename,
    });
    
  } catch (err) {
    console.log(`   ✗ CAPTURE ERROR (${label}): ${err.message}`);
  }
}

// Capture the page exactly as it was when the test stopped, so the customer report
// links to the failure moment itself instead of Playwright's post-teardown screenshot
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach('Failure Screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  }
});


for (const row of runnableData) {

test(`Test case: ${row.TestCase}`, async ({ page ,request},testInfo ) => {
      
      await page.goto(config.baseURL);

      const login = new LoginPage(page);
      await login.loginWithCredentials(config.username, config.password);

     
      const index = new IndexPage(page);
      await index.clickShipping();



      const deliveryId = row.DeliveryID;
      const shipMethod = row.ShipMethod;
      const weight     = row.Weight;
      
      const shipping = new ShippingPage(page);

      const length=row.Length;
      const width=row.Width;
      const height=row.Height;
      const carrierCheck=row.ShipMethod.toLowerCase();
      const payMethod = row.payMethod;
      const AccountNumber = row.AccountNumber||"";
      const dropOffType=row.DropOffType;
      const packagingType=row.Packaging;

      const lpnFlag = (row.LPNFlag || "").toLowerCase();

      if (lpnFlag === "lpn") {
        await shipping.checkLPNCheckbox();
      }

      await shipping.enterdeliveryid(deliveryId);
      await shipping.clickdeliverysearchbtn();

      const consolidationDeliveries = (row.ConsolidationDeliveries || "").toString().trim();
      if (consolidationDeliveries) {
        await handleConsolidation(page, row);
      }

      await shipping.selectShipMethod(shipMethod);

      
      // if(carrierCheck.includes("fedex") || carrierCheck.includes("federal express")){
      //   await shipping.clickonDropOffTypebtn();
      //   await shipping.selectDropOffType(dropOffType);
      //   await shipping.selectPackaging(packagingType);
      //   await shipping.dropOffpopupClose();
      // }

      if(carrierCheck.includes("dhl") && payMethod.toLowerCase()=== "third party billing"){
          const [newPage] = await Promise.all([
          page.context().waitForEvent('page'),
          shipping.selectpayMethod(payMethod),
          ]);

          const newShipping = new ShippingPage(newPage);
          await newShipping.dhlTPBModalSave();
      
      }else{
          await shipping.selectpayMethod(payMethod);
      }

      if(carrierCheck.includes("ups")&& payMethod.toLowerCase() === "third party billing"){
          const [newPage] = await Promise.all([
          page.context().waitForEvent('page'),
          shipping.clickonUpsTPBModal(),
          ]);
          await newPage.waitForLoadState();
          const newShipping = new ShippingPage(newPage);
          await newShipping.upsTPBModalSave();         
      }

      await page.waitForTimeout(2000);
      if(!(payMethod.toLowerCase() === "prepaid")){     
        await shipping.enterAccountNumber(AccountNumber);
      }

      const isFreight = (row.FreightFlag || "").toLowerCase();

      if (isFreight === "yes" || isFreight === "y") {
        await handleFreightDetails(page, row);
      } else {
        await shipping.enterWeight(weight);
        await shipping.openDimensionPopup();
        await shipping.enterDimensions(length, width, height);
        await shipping.saveDimensions();
      }
      await shipping.enterPhoneNumber();
      await shipping.enterContactName();


      if(carrierCheck.includes("dhl")){
        await shipping.editDestinationAddress();
        //await shipping.enterAddressLine1();
        await shipping.enterAddressLine2();
        //await shipping.enterAddressLine3();
        await shipping.closeDestinationAddress();
        await shipping.enterAddtionalInfo();
      }


      if (row.IntlFlag && row.IntlFlag.toUpperCase() === "Y") {
        console.log("International shipment detected");
        await internationalShippingFlow(page, row, shipping);     
      } else {
        console.log("Domestic shipment");
      }

      await page.waitForTimeout(2000);

      // Package Options Handling
      const packageoptionsFlag=(row.PackageOptionsFlag || "").toLowerCase();
      if(packageoptionsFlag==="yes" || packageoptionsFlag==="y"){
        await handlingPackageOptions(page, row, carrierCheck);
      }

      //Handling MPS Count in if condition 
      const postShipment = (row.PostShipFlag || "").toLowerCase();
      const numberOfPackages = row.NumberOfPackages||"";
      const mpsCount = parseInt(row.MPSCount) || 0;
      const mpsBatches = (row.MPSBatches || "").toString().trim()
                           .split(',').map(n => parseInt(n.trim())).filter(n => n > 0);

      if (mpsCount > 0) await shipping.enterMPSCount(mpsCount);

      if (mpsCount > 0 && mpsBatches.length > 0) {
        await shipping.addPackages(mpsBatches[0]);
      } else if (numberOfPackages !== "" && postShipment !== "yes" && postShipment !== "y") {
        await shipping.addPackages(numberOfPackages);
      }

      const hazmat = (row.HazmatFlag || "").toLowerCase();
      if((packageoptionsFlag==="yes" || packageoptionsFlag==="y") && (hazmat==="yes" || hazmat==="y") && numberOfPackages!=="" && numberOfPackages > 0){
        await handlingMultiPackageHazmat(page, row, carrierCheck, numberOfPackages);
      }

      await shipping.selectPrinter(config.printerName);

      //await shipping.selectShipmentDate("2026-04-21 15:36:46");

      await page.waitForTimeout(3000);

      //click on ship and validate ship message
      await shipping.clickShip();
      
      const shipMessage = await shipping.getMessage();
      console.log("Ship Message: " + shipMessage);
      expect.soft(shipMessage).toContain("Shipped Successfully");

      // Capture the actual confirmation screenshot here — the Void step later in this
      // test reloads the page, so Playwright's automatic end-of-test screenshot misses this moment
      await captureShipmentConfirmation(page, testInfo, 'initial ship', shipping.successMessage);

      // Download and validate label - Forward Shipping
      const trackingNumberValue = await shipping.waybillNumber.getAttribute('value');
      console.log("Tracking Number: " + trackingNumberValue);
      await openLabelInNewTab(page,row,request,trackingNumberValue,"Forward Shipping");

      
      // MPS: batch 1 remaining labels (#2, #3...)
      if (mpsCount > 0 && mpsBatches[0] > 1) {
        for (let i = 2; i <= mpsBatches[0]; i++) {
          const t = await page.locator(`#trackingNumberID${i}`).getAttribute('value');
          console.log(`MPS Package ${i} Tracking: ` + t);
          if (!carrierCheck.includes("dhl"))
            await openLabelInNewTab(page, row, request, t, `MPS Package ${i}`);
        }
      }

      // MPS: subsequent batches (batch 2 onwards)
      if (mpsCount > 0 && mpsBatches.length > 1) {
        let index = mpsBatches[0] + 1;
        for (let batch = 1; batch < mpsBatches.length; batch++) {
          await shipping.addPackages(mpsBatches[batch]);
          await page.waitForTimeout(2000);
          await shipping.clickShip();
          const msg = await shipping.getMessage();
          expect.soft(msg).toContain("Shipped Successfully");
          await captureShipmentConfirmation(page, testInfo, `MPS batch ${batch}`, shipping.successMessage);
          for (let j = 0; j < mpsBatches[batch]; j++) {
            const t = await page.locator(`#trackingNumberID${index}`).getAttribute('value');
            console.log(`MPS Package ${index} Tracking: ` + t);
            if (!carrierCheck.includes("dhl"))
              await openLabelInNewTab(page, row, request, t, `MPS Package ${index}`);
            index++;
          }
        }
      }

      //Adding Packages After ship
      if((postShipment === "yes" || postShipment === "y") && numberOfPackages !== "" ){
         await shipping.addPackages(numberOfPackages);
         await shipping.clickShip();
         const postShipMsg = await shipping.getMessage();
         expect.soft(postShipMsg).toContain("Shipped Successfully");
         await captureShipmentConfirmation(page, testInfo, 'post-shipment packages', shipping.successMessage);

      }

      // Download labels for additional packages
      let finalPackages = numberOfPackages;
      if (lpnFlag === "delivery") {
        const lpnPackageCount = await page.locator('[id^="pkgNameID"]').count();
        finalPackages = lpnPackageCount - 1;
      }

      if(finalPackages !== "" && finalPackages > 0){
        for(let i = 2; i <= finalPackages + 1; i++){
          const pkgTrackingNumber = await shipping.getTrackingNumberByIndex(i);
          console.log(`Package ${i} Tracking Number: ` + pkgTrackingNumber);
          if(!carrierCheck.includes("dhl")){
            await openLabelInNewTab(page,row,request,pkgTrackingNumber,`Package ${i} Shipping`);
          }
        }
      }

      //Consolidation 
      const consolidation=new Consolidation(page);
      if(consolidationDeliveries){
        await shipping.clickMore();
        await page.waitForTimeout(5000);
        await consolidation.openConsolidation();
        const deliveries = consolidationDeliveries.split(',');
        const allLabelPrinted = await consolidation.allStatusesLabelPrinted(deliveries.length);
        expect.soft(allLabelPrinted).toBeTruthy();
        console.log("Consolidation status validation:", allLabelPrinted ? "PASSED" : "FAILED");
        await consolidation.closeConsolidation();

        for(const delivery of deliveries) {
          await shipping.enterdeliveryid(delivery);
          await shipping.clickdeliverysearchbtn();
          await page.waitForTimeout(5000);

          const shipmethod=await shipping.getShipMethod();
          await page.waitForTimeout(2000);
          expect.soft(shipmethod).toContain(row.ShipMethod);
          console.log(`Child delivery ${delivery}: ShipMethod = ${shipmethod}`);

          const weight = await shipping.getWeight();
          await page.waitForTimeout(2000);
          expect.soft(weight).toBe('0.01');
          console.log(`Child delivery ${delivery}: Weight = ${weight}`);

        }

        await shipping.enterdeliveryid(deliveryId);
        await shipping.clickdeliverysearchbtn();
        await page.waitForTimeout(2000);

      }

      //return shipment label handling
      const returnShipment = (row.ReturnFlag || "").toLowerCase();
      const documents=new Documents(page);
        
      if(returnShipment === "yes" || returnShipment === "y"){
        await shipping.clickMore();
        await page.waitForTimeout(5000);
        await documents.openViewLabelPopup();  
        const returntrackingNumberValue = await documents.getReturnTrackingNumber();
        console.log("Return Tracking Number: " + returntrackingNumberValue);
        await documents.closeViewLabelPopup();
        await openLabelInNewTab(page,row,request,returntrackingNumberValue,"Return Shipping");
      }

  

      if((packageoptionsFlag==="yes" || packageoptionsFlag==="y") && !carrierCheck.includes("smartpost") && !(returnShipment === "yes" || returnShipment === "y")){
        console.log("Validating PDF Documents");
        await shipping.clickMore();
        await page.waitForTimeout(5000);
        await documents.openViewLabelPopup();
        await documents.pdfHandling(testInfo, row);
        await documents.closeViewLabelPopup();      
      }

      const intl=new InternationalPage(page);

      if(row.IntlFlag && row.IntlFlag.toUpperCase() === "Y"){
        console.log("Validating International Documents PDF");
        await intl.openInternationalPage();
        await intl.viewCIDocument(testInfo, trackingNumberValue, row, page);
        if(carrierCheck.includes("fedex") || carrierCheck.includes("federal express")){
          await intl.viewUSCODocument(testInfo, trackingNumberValue, row, page);
        }
        
        await intl.intlpageclose();
      }


      await page.waitForTimeout(1000);

      //  QZ TRAY VALIDATION (REAL PRINTER)
      console.log(" Waiting for real printer via QZ Tray...");

      let printConfirmed = false;

      for (let i = 0; i < 15; i++) {   // wait 15 seconds
        const result = checkQZPrint(trackingNumberValue);  // <-- IMPORTANT FIX
        if (result) {
          console.log(" Printer Log Found:", result);
          printConfirmed = true;
          break;
        }
        await page.waitForTimeout(5000);
      }

      expect(printConfirmed).toBeTruthy();
      console.log(" Real ZPL Printer printed the label successfully!");

      if(!(carrierCheck.includes("ups"))){
        await shipping.voidShipment();
        const voidMessage = await shipping.getMessage();
        console.log("Void Message: " + voidMessage);
        expect.soft(voidMessage).toContain("Shipment Voided Successfully");
      }

    });
}  

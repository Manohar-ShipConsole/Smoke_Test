
//this is the code of shipping.test.js under the tests

import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages_objects/LoginPage.js";
import { IndexPage } from "../pages_objects/IndexPage.js";
import { ShippingPage } from "../pages_objects/ShippingPage.js";
import { InternationalPage } from "../pages_objects/InternationalPage.js";
import { Documents } from "../pages_objects/Documents.js";
import {handlingPackageOptions, handlingMultiPackageHazmat} from "../utils/PackageOptionsFlow.js";
import { openLabelInNewTab } from "../utils/labelHandler.js";
import { internationalShippingFlow } from "../utils/internationalShippingFlow.js";
import { readExcelSync } from "../utils/excelReader.js";

//import { extractPdfText } from "../utils/pdfReader.js";
import { checkQZPrint } from "../utils/qzReader.js";
import config from "../configuration/config.js";



const excelData = readExcelSync("ShippingData_JDE.xlsx", "Sheet1");

const runnableData = excelData.filter(
  row => row.RunFlag && row.RunFlag.toUpperCase() === 'Y'
);
 


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
      
      console.log("Excel Input =", row);

      
      const shipping = new ShippingPage(page);

      const length=row.Length;
      const width=row.Width;
      const height=row.Height;
      const carrierCheck=row.ShipMethod.toLowerCase();
      const payMethod = row.payMethod;
      const AccountNumber = row.AccountNumber||"";
      const dropOffType=row.DropOffType;
      const packagingType=row.Packaging;

      await shipping.enterdeliveryid(deliveryId);
      await shipping.clickdeliverysearchbtn(deliveryId);

      await shipping.selectShipMethod(shipMethod);

      
      if(carrierCheck.includes("fedex") || carrierCheck.includes("federal express")){
        await shipping.clickonDropOffTypebtn();
        await shipping.selectDropOffType(dropOffType);
        await shipping.selectPackaging(packagingType);
        await shipping.dropOffpopupClose();
      }

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

      await shipping.enterWeight(weight);
      await shipping.enterPhoneNumber();
      await shipping.enterContactName();
      await shipping.openDimensionPopup();
      await shipping.enterDimensions(length, width, height);
      await shipping.saveDimensions();


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

      await page.waitForTimeout(5000);

      // Package Options Handling
      const packageoptionsFlag=(row.PackageOptionsFlag || "").toLowerCase();
      if(packageoptionsFlag==="yes" || packageoptionsFlag==="y"){
        await handlingPackageOptions(page, row, carrierCheck);
      }

      const numberOfPackages = row.NumberOfPackages||"";
      if(numberOfPackages!==""){
        await shipping.addPackages(numberOfPackages);
      }

      const hazmat = (row.HazmatFlag || "").toLowerCase();
      if((packageoptionsFlag==="yes" || packageoptionsFlag==="y") && (hazmat==="yes" || hazmat==="y") && numberOfPackages!=="" && numberOfPackages > 0){
        await handlingMultiPackageHazmat(page, row, carrierCheck, numberOfPackages);
      }


      //await shipping.selectShipmentDate("2026-04-21 15:36:46");


      //click on ship and validate ship message
      await shipping.clickShip();
      
      const shipMessage = await shipping.getMessage();
      console.log("Ship Message: " + shipMessage);
      expect.soft(shipMessage).toContain("Shipped Successfully");

      

      // Download and validate label - Forward Shipping
      const trackingNumberValue = await shipping.waybillNumber.getAttribute('value');
      console.log("Tracking Number: " + trackingNumberValue);
      await openLabelInNewTab(page,row,request,trackingNumberValue,"Forward Shipping");

      // Download labels for additional packages
      if(numberOfPackages !== "" && numberOfPackages > 0){
        for(let i = 2; i <= numberOfPackages + 1; i++){
          const pkgTrackingNumber = await shipping.getTrackingNumberByIndex(i);
          console.log(`Package ${i} Tracking Number: ` + pkgTrackingNumber);
          if(!(carrierCheck.includes("dhl"))){
            await openLabelInNewTab(page,row,request,pkgTrackingNumber,`Package ${i} Shipping`);
          }
        }
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
        expect.soft(voidMessage).toContain("Shipment is Void");
      }

    });
}  

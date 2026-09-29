import { test, expect } from "@playwright/test";


import { LoginPage } from "../pages_objects/LoginPage.js";
import { IndexPage } from "../pages_objects/IndexPage.js";
import { ShippingPage } from "../pages_objects/ShippingPage.js";
import { InternationalPage } from "../pages_objects/InternationalPage.js";
import { Documents } from "../pages_objects/Documents.js";
import { readExcelSync } from "../utils/excelReader.js";
import {handlingPackageOptions} from "../utils/PackageOptions.js";
import { openLabelInNewTab } from "../utils/labelHandler.js";
import { internationalShippingFlow } from "../utils/internationalShippingFlow.js";

//import { extractPdfText } from "../utils/pdfReader.js";
import { checkQZPrint } from "../utils/qzReader.js";
import config from "../configuration/config.js";



const excelData = readExcelSync("ShippingData_SCM.xlsx", "Sheet1");

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

      
      await shipping.enterdeliveryid(deliveryId);
      await shipping.clickdeliverysearchbtn(deliveryId);

      const carrierCheck=row.ShipMethod.toLowerCase();// to check carrier from ship method
      const dropOffType=row.DropOffType;
      const packagingType=row.Packaging;

       await shipping.selectShipMethod(shipMethod);
      // if(carrierCheck.includes("fedex") || carrierCheck.includes("federal express")|| carrierCheck.includes("fdxg")){
      //   await shipping.selectDropOffType(dropOffType);
      //   await shipping.selectPackaging(packagingType);
      // }
      await page.waitForTimeout(3000);
      const payMethod = row.payMethod;
      
      if(carrierCheck.includes("ups")&& payMethod.toLowerCase() === "third party billing"){
          const [newPage] = await Promise.all([
          page.context().waitForEvent('page'),
          shipping.selectpayMethod(payMethod),
          ]);
          await newPage.waitForLoadState();
          const newShipping = new ShippingPage(newPage);
          await newShipping.upsTPBModal();
          await newPage.close();
      }else{  
          await shipping.selectpayMethod(payMethod);
      }
      
      const AccountNumber = row.AccountNumber||"";
      await page.waitForTimeout(2000);
      if(!(payMethod.toLowerCase() === "prepaid")){
        
        if (AccountNumber) {
          await shipping.enterAccountNumber(AccountNumber);
        }
      }


      await shipping.enterWeight(weight);

      const length=row.Length;
      const width=row.Width;
      const height=row.Height;

      // await shipping.openDimensionPopup();
      // await shipping.enterDimensions(length, width, height);
      // await shipping.saveDimensions();

      if (row.IntlFlag && row.IntlFlag.toUpperCase() === "Y") {
        console.log("International shipment detected");
        await internationalShippingFlow(page, row);     
      } else {
        console.log("Domestic shipment");
      }

      // Package Options Handling
      const packageoptionsFlag=(row.PackageOptionsFlag || "").toLowerCase();
      if(packageoptionsFlag==="yes" || packageoptionsFlag==="y"){
        await handlingPackageOptions(page, row, carrierCheck);
      }

      const numberOfPackages = row.NumberOfPackages||"";
      if(numberOfPackages!==""){
        await shipping.addPackages(numberOfPackages);
      }

      if(carrierCheck.includes("smartpost")){
       await shipping.selectAccountNumber(AccountNumber);   

      }


      //click on ship and validate ship message
      await page.waitForTimeout(2000);
      await shipping.clickShip();
      const shipMessage = await shipping.getMessage();
      console.log("Ship Message: " + shipMessage);
      expect.soft(shipMessage).toContain("Shipped Successfully");

      // Download and validate label - Forward Shipping
      const trackingNumberValue = await shipping.waybillNumber.getAttribute('value');
      console.log("Tracking Number: " + trackingNumberValue);
      await openLabelInNewTab(page, row, request,trackingNumberValue,"Forward Shipping");

      //return shipment label handling
      const returnShipment = (row.ReturnFlag || "").toLowerCase();
      const documents=new Documents(page);
        
      if(returnShipment === "yes" || returnShipment === "y"){
        await documents.openViewLabelPopup();  
        const returntrackingNumberValue = await documents.getReturnTrackingNumber();
        console.log("Return Tracking Number: " + returntrackingNumberValue);
        await documents.closeViewLabelPopup();
        await openLabelInNewTab(page, row, request,returntrackingNumberValue,"Return Shipping");
      }

      if(packageoptionsFlag==="yes" || packageoptionsFlag==="y"&&!carrierCheck.includes("smartpost")&&!(returnShipment === "yes" || returnShipment === "y")){
        console.log("Validating PDF Documents");
        await documents.openViewLabelPopup();
        await documents.pdfHandling(testInfo);
        await documents.closeViewLabelPopup();       
      }

      const intl=new InternationalPage(page);

      if(row.IntlFlag && row.IntlFlag.toUpperCase() === "Y"){
        console.log("Validating Commercial Invoice PDF");
        await intl.openInternationalPage();
        await intl.viewCIDocument(testInfo,row);
        await intl.viewUSCODocument(testInfo,row);
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

      await page.waitForTimeout(8000);

      if(!(carrierCheck.includes("ups"))){
        await shipping.voidShipment();
        const voidMessage = await shipping.getMessage();
        console.log("Void Message: " + voidMessage);
        expect.soft(voidMessage).toContain("Shipment is Void");
      }

    });
}  

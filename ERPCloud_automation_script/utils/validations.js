import { ShippingPage } from '../pages_objects/ShippingPage';
import { InternationalPage } from '../pages_objects/InternationalPage';
import test, { expect } from '@playwright/test';


export async function validateFiles(page,row,text,filename){
    
      const shipping= new ShippingPage(page);

      //shipping details
      const customerName=await shipping.getCustomerName();
      const shipToValue= await shipping.getShipTovalue();
      const line1Value= await shipping.getAddressLine1();
      const line2Value= await shipping.getAddressLine2();
      const line3Value= await shipping.getAddressLine3();
      const cityName= await shipping.getCityName();
      const stateName= await shipping.getStateName();
      const postalCode= await shipping.getPostalCode();
      const countryName= await shipping.getCountryName();
      const contactNameValue= await shipping.getContactName();
      const phoneNumberValue= await shipping.getPhoneNumber();
      const weightValue= await shipping.getWeight();
      const ref1= await shipping.getReference1();
      const ref2= await shipping.getReference2();
      const department= await shipping.getDepartment();
      const payMethod= await shipping.getCarrierPayMethod();
      const accountNumber= await shipping.getCarrierAccountNumber();
      const shipmentDate= await shipping.getShipmentDate();
      const dimensions= await shipping.getDimensions();
      const recipientEmail= await shipping.getRecipientEmail();

      // const length=row.Length;
      // const width=row.Width;
      // const height=row.Height;

      // const dimensionsString=`${length}x${width}x${height}`;

      const shipDate= await shipping.getShipDate();
      const CIDate= await shipping.getCIShipDate();

      
      //hazmat details
      const classType = row?.ClassType;
      if (!classType) {
        return; // skip this row
      }
      const [leftPart, rightPart] = classType.split("-");
      const classNumber = leftPart.match(/\d+/)[0];
      const description = rightPart.trim();

      const hazmatid = row.HazMatId;
      const [unid, context] = hazmatid.split("-");
      const unidNumber=unid.trim();
     // const unidDescription=context.trim();

      const weight=row.HazmatWeight;
      const units=row.HazmatUnit;
      const idnumber=row.IdentificationNumber;
      const emergencyContactName=row.EmergencyContactName;
      const emergencyContactNumber=row.EmergencyContactNo;
      const packagingGroup=row.PackagingGroup;
      const packagingCount=row.PackagingCount;
      const packagingUnits=row.PackagingUnits;
      const technicalName=row.TechnicalName;
      const signatureName=row.SignatureName;
      const packingInstructions=row.PackingInstructions;

      //Intl Values
      const internationalNew = new InternationalPage(page);
      
      await internationalNew.openInternationalPage();
      await internationalNew.clickOnCommodity();
      await internationalNew.clickEditCommodity();
      
      const purpose=internationalNew.getPurpose();
      const termsOfSale=internationalNew.getTermsOfSale();
      const commodityDescription=internationalNew.getDescription(); 
      const harmonizedCode=internationalNew.getHarmonizedCode();
      const numberOfPieces=internationalNew.getNumberOfPieces();
      const quantity=internationalNew.getQuantity();
      const weightIntl=internationalNew.getWeight();
      const customsValue=internationalNew.getCustomsValue();

      const importerCompanyName= await internationalNew.getImporterCompanyName();
      const importerLine1= await internationalNew.getImporterAddressLine1();
      const importerLine2= await internationalNew.getImporterAddressLine2();
      const importerCity= await internationalNew.getImporterCity();
      const importerState= await internationalNew.getImporterState();
      const importerPostalCode= await internationalNew.getImporterPostalCode();
    
      
      expect.soft(text).toContain(line1Value);
      expect.soft(text).toContain(line2Value);
      expect.soft(text).toContain(cityName);
      expect.soft(text).toContain(stateName);
      expect.soft(text).toContain(postalCode);
      expect.soft(text).toContain(countryName);
      
    if(filename.includes('Return')){
      console.log("Validating Return Shipping Label");
      expect.soft(text).toContain('RETURNS');
      expect.soft(text).toContain(shipToValue);
      expect.soft(text).toContain(shipmentDate);
      expect.soft(text).toContain(contactNameValue);
      expect.soft(text).toContain(customerName);
      expect.soft(text).toContain(ref1);
      expect.soft(text).toContain(ref2);
      expect.soft(text).toContain(department.toUpperCase());
      expect.soft(text).toContain(dimensionsString);

    }else if(filename.includes('label')){
      console.log("Validating Forward Shipping Label");
      expect.soft(text).toContain(shipToValue);
      expect.soft(text).toContain(customerName);
      expect.soft(text).toContain(contactNameValue);
      expect.soft(text).toContain(phoneNumberValue);
      expect.soft(text).toContain(weightValue);
      expect.soft(text).toContain(`${stateName}-${countryName}`);
      expect.soft(text).toContain(ref1);
      expect.soft(text).toContain(ref2);
      expect.soft(text).toContain(department.toUpperCase());
      expect.soft(text).toContain(shipmentDate);
      expect.soft(text).toContain(dimensions);
      expect.soft(text).toContain(dimensionsString);
      if(payMethod =="PP"){
        expect.soft(text).toContain('BILL SENDER');
      }else if(payMethod =="CG"){
        expect.soft(text).toContain('BILL RECIPIENT');
      }else if(payMethod =="TP"){
        expect.soft(text.includes('BILL THIRD PARTY') ||text.includes('BILL 3rd PARTY')).toBeTruthy();
      }
    }else if(filename.includes('USCO')){
      console.log("Validating Certificate of Origin");
      expect.soft(text).toContain('CERTIFICATE OF ORIGIN');
      expect.soft(text).toContain(customerName);
      expect.soft(text).toContain(commodityDescription);
      expect.soft(text).toContain('FDXE');
      expect.soft(text).toContain(purpose);
      expect.soft(text).toContain(harmonizedCode);

    }else if(filename.includes('CI')){
      console.log("Validating Commercial Invoice"); 
      expect.soft(text).toContain('COMMERCIAL INVOICE');
      expect.soft(text).toContain(customerName);
      expect.soft(text).toContain(purpose);
      expect.soft(text).toContain(commodityDescription);
      expect.soft(text).toContain(harmonizedCode);
      expect.soft(text).toContain(numberOfPieces);
      expect.soft(text).toContain(quantity);
      expect.soft(text).toContain(weightIntl);
      expect.soft(text).toContain(customsValue);
      expect.soft(text).toContain('EA');
      expect.soft(text).toContain('US');
      expect.soft(text).toContain('USD');
      expect.soft(text).toContain(termsOfSale);
      expect.soft(text).toContain(CIDate);
      expect.soft(text).toContain(importerCompanyName);
      expect.soft(text).toContain(importerLine1);
      expect.soft(text).toContain(importerLine2);
      expect.soft(text).toContain(importerCity);
      expect.soft(text).toContain(importerState);
      expect.soft(text).toContain(importerPostalCode);
      expect.soft(text).toContain(shipToValue);
      expect.soft(text).toContain(recipientEmail);
      expect.soft(text).toContain(ref1);

    }else if(filename.includes('DGForm')){
      console.log("Validating Dangerous Goods Declaration Form");
      expect.soft(text).toContain('SHIPPER\'S DECLARATION FOR DANGEROUS GOODS');
      expect.soft(text).toContain('UN');
      expect.soft(text).toContain(weight);
      expect.soft(text).toContain(units);
      expect.soft(text).toContain(idnumber);
      expect.soft(text).toContain(emergencyContactName);
      expect.soft(text).toContain(emergencyContactNumber);
      expect.soft(text).toContain(packagingGroup);
      expect.soft(text).toContain(packagingCount);
      expect.soft(text).toContain(packagingUnits);
      expect.soft(text).toContain(technicalName);
      expect.soft(text).toContain(signatureName);
      expect.soft(text).toContain(packingInstructions);
      expect.soft(text).toContain(classNumber);
      expect.soft(text).toContain(description);
      expect.soft(text).toContain(shipDate);
    }else if(filename.includes('Op900')){
      console.log("Validating OP900 Hazmat Form");
      expect.soft(text).toContain(accountNumber);
      expect.soft(text).toContain(unidNumber);
      expect.soft(text).toContain(weight);
      expect.soft(text).toContain(units);
      expect.soft(text).toContain(emergencyContactName);
      expect.soft(text).toContain(emergencyContactNumber);
      expect.soft(text).toContain(packagingGroup);
      expect.soft(text).toContain(packagingCount);
      expect.soft(text).toContain(packagingUnits);
      expect.soft(text).toContain(technicalName);
      expect.soft(text).toContain(classNumber);
      expect.soft(text).toContain(description);
      expect.soft(text).toContain(shipDate);

    }

}
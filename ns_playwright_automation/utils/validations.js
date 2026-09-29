import { ShippingPage } from '../pages_objects/ShippingPage.js';
import { InternationalPage } from '../pages_objects/InternationalPage.js';
import test, { expect } from '@playwright/test';


export async function validateFiles(page,row,text,filename, intlInstance = null){
   
      const shipping= new ShippingPage(page);
 
      //shipping details
      const customerName=await shipping.getCustomerName();
      //const shipToValue= await shipping.getShipTovalue();
      const line1Value= await shipping.getAddressLine1();
      const line2Value= await shipping.getAddressLine2();
      const line3Value= await shipping.getAddressLine3();
      const cityName= await shipping.getCityName();
      const stateName= await shipping.getStateName();
      const postalCode= (await shipping.getPostalCode()).replace(/\s+/g, '');
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
      //const recipientEmail= await shipping.getRecipientEmail();
 
      const length=row.Length;
      const width=row.Width;
      const height=row.Height;
 
      const dimensionsString=`${length}x${width}x${height}`;
      const upsDimensionString=`${length},${height},${width}`;
      const upsDGDimensionString=`${height},${length},${width}`;
      const upsMDGDimensionString=`${height},${width},${length}`;

      //const shipDate= await shipping.getShipDate();
      //const CIDate= await shipping.getCIShipDate();

      // hazmat values — captured during PackageOptions setup and stored in row._hazmatValues
      let unidNumber = '', classNumber = '', description = '', weight = '',
          units = '', idnumber = '', emergencyContactName = '', emergencyContactNumber = '',
          packagingGroup = '', packagingCount = '', packagingUnits = '',
          technicalName = '', signatureName = '', packingInstructions = '';

      const isUPS = (row.ShipMethod || '').toLowerCase().includes('ups');
      const isFDXG = (row.ShipMethod || '').toLowerCase().includes('fdxg');
      const isDHL = (row.ShipMethod || '').toLowerCase().includes('dhl');
      const isSmartpost = (row.ShipMethod || '').toLowerCase().includes('smartpost');
      const upsDimensionsString =  dimensionsString.replace(/x/gi, ',');
      const fdxgDimensionsString= dimensionsString.toUpperCase();
      const m = shipmentDate.match(/^(\d{2})([A-Z]{3})(\d{2})$/i);
      const upsDate = m ? `${m[1]} ${m[2].toUpperCase()} 20${m[3]}` : shipmentDate;
      const monthMap = { JAN:'01',FEB:'02',MAR:'03',APR:'04',MAY:'05',JUN:'06',JUL:'07',AUG:'08',SEP:'09',OCT:'10',NOV:'11',DEC:'12' };
      const dhlDate = m ? `20${m[3]}-${monthMap[m[2].toUpperCase()]}-${m[1]}` : shipmentDate;
      
      if (filename.includes('DGForm') || filename.includes('Op900')) {
        const hazmatValues = row._hazmatValues || {};
        const carrierCheck = (row.ShipMethod || "").toLowerCase();
        const hazmatIdText = hazmatValues.hazmatIdText || '';
        const unMatch = hazmatIdText.match(/UN\s*(\d+)/i);
        unidNumber          = carrierCheck.includes("ups") ? (hazmatValues.unid || '') : (unMatch ? `UN ${unMatch[1]}` : '');
        const classText     = hazmatValues.classText || '';
        classNumber         = classText.match(/^\d+/)?.[0] ?? '';
        description         = hazmatIdText.includes('-') ? hazmatIdText.split(/\s*-\s*/).slice(1).join(' ').trim() : '';
        weight              = hazmatValues.weight || '';
        units               = hazmatValues.units || '';
        idnumber            = (hazmatValues.idnumber || '').replace(/^UN\s*/i, '');
        emergencyContactName   = hazmatValues.emergencyContactName || '';
        emergencyContactNumber = hazmatValues.emergencyContactNumber || '';
        packagingGroup      = hazmatValues.packagingGroup || '';
        packagingCount      = hazmatValues.packagingCount || '';
        packagingUnits      = hazmatValues.packagingUnits || '';
        technicalName       = hazmatValues.technicalName || '';
        signatureName       = hazmatValues.signatureName || '';
        packingInstructions = hazmatValues.packingInstructions || '';
      }

      //Intl Values — only fetched for CI and USCO validations
      let purpose, termsOfSale, commodityDescription, harmonizedCode,
          numberOfPieces, quantity, weightIntl, customsValue,
          importerCompanyName, importerLine1, importerLine2,
          importerCity, importerState, importerPostalCode;

      if (filename.includes('CI') || filename.includes('USCO')) {
        
          const internationalNew = intlInstance || new InternationalPage(page);
          if (!intlInstance) {
            await internationalNew.openInternationalPage();
          }
          await internationalNew.clickOnCommodity();
          await internationalNew.clickEditCommodity();

          if(!isDHL)purpose = await internationalNew.getPurpose();
          termsOfSale = await internationalNew.getTermsOfSale();
          commodityDescription = await internationalNew.getDescription();
          harmonizedCode = await internationalNew.getHarmonizedCode();
          numberOfPieces = await internationalNew.getNumberOfPieces();
          quantity = await internationalNew.getQuantity();
          weightIntl = await internationalNew.getWeight();
          if (!isUPS && !isDHL) {
            customsValue = await internationalNew.getCustomsValue();
          }

          if (!isUPS && !isDHL) {
            importerCompanyName = await internationalNew.getImporterCompanyName();
            importerLine1 = await internationalNew.getImporterAddressLine1();
            importerLine2 = await internationalNew.getImporterAddressLine2();
            importerCity = await internationalNew.getImporterCity();
            importerState = await internationalNew.getImporterState();
            importerPostalCode = (await internationalNew.getImporterPostalCode()).replace(/\s+/g, '');
          }
       
      }
   
     
      const isReturn = filename.includes('Return');
      const isUPSLabel = isUPS && filename.includes('label');
      if (!(isUPS && filename.includes('DGForm'))&& !(isFDXG && filename.includes('OP900'))) {
        expect.soft(text).toContain((isReturn && !isFDXG) || isUPSLabel ? line1Value.toUpperCase() : line1Value);
        if (!filename.includes('DGForm') && !(isUPS && isReturn) && !isSmartpost) expect.soft(text).toContain((isReturn && !isFDXG) || isUPSLabel ? line2Value.trim().toUpperCase() : line2Value.trim());
        expect.soft(text).toContain((isReturn && !isFDXG) || isUPSLabel ? cityName.toUpperCase() : cityName);
        if(!isDHL)expect.soft(text).toContain(stateName);
        expect.soft(text.replace(/\s+/g, '')).toContain(postalCode);
        expect.soft(text).toContain(countryName);
      }

    if(isReturn){
      console.log("Validating Return Shipping Label");
      expect.soft(text.includes('RETURNS') ||text.includes('RETURN')).toBeTruthy()
      expect.soft(text).toContain(ref1);
      expect.soft(text).toContain(ref2);
      //expect.soft(text).toContain(shipToValue);
      if(!isFDXG && (!isUPS || (row.IntlFlag && row.IntlFlag.toUpperCase() === 'Y')))expect.soft(text).toContain(isUPS?upsDate:shipmentDate);
      expect.soft(text).toContain(isFDXG ? contactNameValue : contactNameValue.toUpperCase());
      expect.soft(text).toContain(isFDXG ? customerName : customerName.toUpperCase());

      if (!isUPS){
        expect.soft(text).toContain(department.toUpperCase());
        if(!isDHL)expect.soft(isFDXG ? text.replace(/\s+/g, '') : text).toContain(isFDXG ? fdxgDimensionsString : dimensionsString);
      }
      if (isUPS) {
        expect.soft(text.includes(upsDimensionsString) || text.includes(upsDimensionString)|| text.includes(upsDGDimensionString)|| text.includes(upsMDGDimensionString)).toBeTruthy();
      }

    }else if(filename.includes('label')){
      console.log("Validating Forward Shipping Label");
      if(!isSmartpost)expect.soft(text).toContain(isUPS?String(parseFloat(weightValue)) : weightValue);
      expect.soft(text).toContain(ref1);
      expect.soft(text).toContain(ref2);
      //expect.soft(text).toContain(shipToValue);
      expect.soft(text).toContain(isUPS ? customerName.toUpperCase() : customerName);
      expect.soft(text).toContain(isUPS ? contactNameValue.toUpperCase() : contactNameValue);

      if (!isUPS && !isDHL) {
        if (!isFDXG ) expect.soft(text).toContain(`${stateName}-${countryName}`);
        if(!isSmartpost){
          expect.soft(text).toContain(shipmentDate);
          expect.soft(isFDXG ? text.replace(/\s+/g, '') : text).toContain(isFDXG ? fdxgDimensionsString : dimensionsString);
          expect.soft(text).toContain(department.toUpperCase()); 
        }
      }
      
      if (isDHL) {
        expect.soft(text).toContain(dhlDate);
      } 
  
      if (isUPS) {
        if(payMethod =="PP"){
          expect.soft(text.includes('P/P') ||text.includes('F/D')).toBeTruthy();
        }else if(payMethod =="CG"){
          expect.soft(text.includes('F/C')||text.includes('CONSIGNEE')).toBeTruthy();
        }else if(payMethod =="TP"){
          expect.soft(text.includes('3RD PARTY')||text.includes('TPS')||text.includes('TPR')).toBeTruthy();
        }
        if (row.IntlFlag && row.IntlFlag.toUpperCase() === 'Y') {
          expect.soft(text).toContain(upsDate);
        }
        expect.soft(text.includes(upsDimensionsString) || text.includes(upsDimensionString)|| text.includes(upsDGDimensionString)|| text.includes(upsMDGDimensionString)).toBeTruthy();
      
      } else if(!isDHL&& !isSmartpost){
        if(payMethod =="PP"){
          expect.soft(text).toContain('BILL SENDER');
        }else if(payMethod =="CG"){
          expect.soft(text).toContain('BILL RECIPIENT');
        }else if(payMethod =="TP"){
          expect.soft(text.includes('BILL THIRD PARTY') ||text.includes('BILL 3rd PARTY')).toBeTruthy();
        }
        expect.soft(text).toContain(phoneNumberValue);
      }
    }else if(filename.includes('USCO')){
      console.log("Validating Certificate of Origin");
      expect.soft(text).toContain('CERTIFICATE OF ORIGIN');
      expect.soft(text).toContain(customerName);
      expect.soft(text).toContain(commodityDescription);
      if(!isFDXG){
        expect.soft(text).toContain('FDXE');
      }
      expect.soft(text).toContain(purpose.toUpperCase());
 
    }else if(filename.includes('CI')){
      console.log("Validating Commercial Invoice");
      expect.soft(text).toContain(customerName);
      expect.soft(text).toContain(commodityDescription);
      expect.soft(text).toContain(numberOfPieces);
      expect.soft(text).toContain(quantity);
      expect.soft(text).toContain('US');
      expect.soft(text.includes('USD')||text.includes('United States')).toBeTruthy();
      expect.soft(text).toContain(termsOfSale);
      //expect.soft(text).toContain(CIDate);
      if (!isUPS && !isDHL) {
        expect.soft(text).toContain(importerCompanyName);
        expect.soft(text).toContain(importerLine1);
        expect.soft(text).toContain(importerLine2);
        expect.soft(text).toContain(importerCity);
        expect.soft(text).toContain(importerState);
        expect.soft(text).toContain(importerPostalCode);
        if(!isFDXG){
          expect.soft(text).toContain('COMMERCIAL INVOICE');
        }
        expect.soft(text).toContain(customsValue);
      }
      if (!isUPS) {
        expect.soft(text).toContain(ref1);
        expect.soft(text).toContain(weightIntl);
      }
      if(!isDHL){
        expect.soft(text).toContain(purpose.toUpperCase());
        expect.soft(text).toContain(harmonizedCode);
      }
      //expect.soft(text).toContain(shipToValue);
      //expect.soft(text).toContain(recipientEmail);
     
 
    }else if(filename.includes('DGForm')){
      console.log("Validating Dangerous Goods Declaration Form");
      if(!isUPS){
        expect.soft(text).toContain('SHIPPER\'S DECLARATION FOR DANGEROUS GOODS');
      }
      expect.soft(text).toContain(unidNumber);
      expect.soft(text).toContain(description);
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

    }else if(filename.includes('Op900') || filename.includes('OP900')){
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

    }
 
}
// this is the code of PackageOptions.js under the utils 

import { PackageOption } from '../pages_objects/PackageOption.js';

export async function handlingPackageOptions(page, row, carrierCheck) {

  const packageoptions = new PackageOption(page);

  //Open Package Options
  await packageoptions.openPackageOptions();

  //smartPost Handling
  if(carrierCheck.includes("smartpost")){
    const indiciaType=row.IndiciaType;
    const endorsementType=row.EndorsementType;
    await packageoptions.fedexIndiciaTypeSelectID(indiciaType);
    await packageoptions.fedexAncillaryEndorsementSelectID(endorsementType);
    await packageoptions.saveFedexPackageOptions();
  }

  //Hazmat Handling
  const hazmat = (row.HazmatFlag || "").toLowerCase();
  const multiHazmat = (row.MultiHazmatFlag || "").toLowerCase();
  const numberOfHazmats = row.NumberOfHazmats;
  const hazardousMaterialType = row.HazardousMaterialType;
  const hazmatid = row.HazMatId;
  const classType=row.ClassType;
  const weight=row.HazmatWeight;
  const units=row.HazmatUnit;
  const idnumber=row.IdentificationNumber;
  const labelType=row.DotLabelType
  const emergencyContactName=row.EmergencyContactName;
  const emergencyContactNumber=row.EmergencyContactNo;
  const packagingGroup=row.PackagingGroup;
  const packagingCount=row.PackagingCount;
  const packagingUnits=row.PackagingUnits;
  const technicalName=row.TechnicalName;
  const signatureName=row.SignatureName;
  const packingInstructions=row.PackingInstructions;
  const authorization=row.Authorization;
  const cargoAircraft=row.CargoAircraft
  const hazmatOptions=row.HazmatOptions;
  const regulationSetValue=row.RegulationSet;
  const quantityType=row.QuantityType;
  const numberOfPackages=row.NumberOfPackages||"";
  const hazmatPackagesStr = (row.HazmatPackages || "").toString().trim();
  const hazmatPackageIndices = hazmatPackagesStr
    ? hazmatPackagesStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
    : [];
  const pkg1IsHazmat = hazmatPackageIndices.length === 0 || hazmatPackageIndices.includes(1);
  console.log("Hazmat Value: "+ hazmat);
  if ((hazmat === "yes" || hazmat === "y") && pkg1IsHazmat) {
    console.log("Entering Hazmat Details");
    await packageoptions.selectHazardousMaterial();
    if(carrierCheck.includes("fedex") || carrierCheck.includes("federal express")|| carrierCheck.includes("fdxg")){
      await packageoptions.selectFedexHazmatId(hazmatid);
      //await packageoptions.selectFedexHazmatMaterialType(hazardousMaterialType);
      //await packageoptions.selectClass(classType);
      //await packageoptions.enterHazmatWeight(weight);
      // await packageoptions.selectUnit(units);
      // await packageoptions.enterIdentificationNumber(idnumber);
      // await packageoptions.enterDotLabelType(labelType);
      // await packageoptions.enterEmergencyContactName(emergencyContactName);
      // await packageoptions.enterEmergencyContact(emergencyContactNumber);
      //  await packageoptions.selectPackagingGroup(packagingGroup);
      // await packageoptions.enterPackagingCount(packagingCount);
      // await packageoptions.enterPackagingUnit(packagingUnits);
      // await packageoptions.enterTechnicalName(technicalName);
      // await packageoptions.enterSignatureName(signatureName);
      // await packageoptions.enterPackingInstruction(packingInstructions);
      // await packageoptions.enterAuthorization(authorization);
      // await packageoptions.selectCargoAircraftOnly(cargoAircraft);
      // await packageoptions.selectHazmatOption(hazmatOptions);
      // await packageoptions.selectHazmatQuantityType(quantityType);
      //await packageoptions.selectHazmatRegulationSet(regulationSetValue);
      await page.waitForTimeout(5000);
      if (!row._hazmatValues) row._hazmatValues = {};
      row._hazmatValues.hazmatIdText           = await packageoptions.getFedexHazmatIdText();
      row._hazmatValues.classText              = await packageoptions.getClassText();
      row._hazmatValues.idnumber               = await packageoptions.getIdentificationNumber();
      row._hazmatValues.units                  = await packageoptions.getUnitText();
      row._hazmatValues.packagingGroup         = await packageoptions.getPackagingGroupText();
      row._hazmatValues.weight                 = await packageoptions.getHazmatWeight();
      row._hazmatValues.emergencyContactName   = await packageoptions.getEmergencyContactName();
      row._hazmatValues.emergencyContactNumber = await packageoptions.getEmergencyContactNumber();
      row._hazmatValues.packagingCount         = await packageoptions.getPackagingCount();
      row._hazmatValues.packagingUnits         = await packageoptions.getPackagingUnits();
      row._hazmatValues.technicalName          = await packageoptions.getTechnicalName();
      row._hazmatValues.signatureName          = await packageoptions.getSignatureName();
      row._hazmatValues.packingInstructions    = await packageoptions.getPackingInstructions();
      await packageoptions.addThisCommodityItem();
      if(multiHazmat==="yes" || multiHazmat==="y"){
        console.log("Adding multiple Hazmat items: "+ numberOfHazmats);
        if(!(carrierCheck.includes("fdxg"))){
          await packageoptions.selectOverpack();
        }
        for(let i=0;i<numberOfHazmats;i++){
          await packageoptions.selectFedexHazmatId("UN3090"); // resets dropdown state first due to application bug
         await packageoptions.selectFedexHazmatId(hazmatid);
          // await packageoptions.selectFedexHazmatMaterialType(hazardousMaterialType);
          // await packageoptions.selectClass(classType);
          // await packageoptions.enterHazmatWeight(weight);
          // await packageoptions.selectUnit(units);
          // await packageoptions.enterIdentificationNumber(idnumber);
          // await packageoptions.enterDotLabelType(labelType);
          // await packageoptions.enterEmergencyContactName(emergencyContactName);
          // await packageoptions.enterEmergencyContact(emergencyContactNumber);
          // await packageoptions.selectPackagingGroup(packagingGroup);
          // await packageoptions.enterPackagingCount(packagingCount);
          // await packageoptions.enterPackagingUnit(packagingUnits);
          // await packageoptions.enterTechnicalName(technicalName);
          // await packageoptions.enterSignatureName(signatureName);
          // await packageoptions.enterPackingInstruction(packingInstructions);
          // await packageoptions.enterAuthorization(authorization);
          // await packageoptions.selectCargoAircraftOnly(cargoAircraft);
          // await packageoptions.selectHazmatOption(hazmatOptions);
          // await packageoptions.selectHazmatQuantityType(quantityType);
          await page.waitForTimeout(5000);
          await packageoptions.addThisCommodityItem();
        }
     }
      
      await page.waitForLoadState('networkidle');

      await page.waitForTimeout(5000);
      await packageoptions.saveFedexPackageOptions();

      console.log("Fedex Hazmat details saved.");
    
    }else if(carrierCheck.includes("ups")){
      console.log("Selecting UPS Hazmat ID: "+ hazmatid);
      await packageoptions.selectUpsHazmatId(hazmatid);

      await page.waitForTimeout(5000);
      if (!row._hazmatValues) row._hazmatValues = {};
      row._hazmatValues.hazmatIdText = await packageoptions.getUpsHazmatIdText();
      await packageoptions.addThisCommodityItem();

       if(multiHazmat==="yes" || multiHazmat==="y"){
        console.log("Adding multiple Hazmat items: "+ numberOfHazmats);
        await page.waitForTimeout(2000);
        await packageoptions.selectOverpack();
        console.log("Overpack selected.");
        for(let i=0;i<numberOfHazmats;i++){
         await packageoptions.selectUpsHazmatId(hazmatid);
         
          await page.waitForTimeout(5000);
          await packageoptions.addThisCommodityItem();
        }
     }

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      await packageoptions.saveUpsPackageOptions();
      console.log("UPS Hazmat details saved.");
    }else if(carrierCheck.includes("dhl")){
      console.log("Selecting DHL Hazmat ID: "+ hazmatid);
      await packageoptions.selectDhlContentId(hazmatid);
      await packageoptions.selectDhlLabelDescription(labelType);
      await packageoptions.enterDhlUnid(idnumber);
      await packageoptions.enterDhlUnitWeight(weight);
      await packageoptions.selectDhlUom(units);
      if (!row._hazmatValues) row._hazmatValues = {};
      row._hazmatValues.unid   = await packageoptions.getDhlUnidValue();
      row._hazmatValues.weight = await packageoptions.getDhlUnitWeightValue();
      await page.waitForTimeout(5000);
      await packageoptions.selectDhlAddThisCommodityItem();
      if(multiHazmat==="yes" || multiHazmat==="y"){
        console.log("Adding multiple Hazmat items: "+ numberOfHazmats);
        for(let i=0;i<numberOfHazmats;i++){
          await packageoptions.selectDhlContentId(hazmatid);
          await packageoptions.selectDhlLabelDescription(labelType);
          await packageoptions.enterDhlUnid(idnumber);
          await packageoptions.enterDhlUnitWeight(weight);
          await packageoptions.selectDhlUom(units);
          await page.waitForTimeout(5000);
          await packageoptions.selectDhlAddThisCommodityItem();
        }
     }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      await packageoptions.saveDhlPackageOptions();

    }

  }

  if ((hazmat === "yes" || hazmat === "y") && !pkg1IsHazmat) {
    console.log("Package 1 is non-hazmat, unchecking hazmat checkbox and saving");
    await packageoptions.unselectHazardousMaterial();
    if (carrierCheck.includes("fedex") || carrierCheck.includes("federal express") || carrierCheck.includes("fdxg")) {
      await packageoptions.unselectSignatureOption();
      await packageoptions.saveFedexPackageOptions();
    } else if (carrierCheck.includes("ups")) {
      await packageoptions.saveUpsPackageOptions();
    } else if (carrierCheck.includes("dhl")) {
      await packageoptions.saveDhlPackageOptions();
    }
  }

  //Return Shipment Handling
  const returnShipment = (row.ReturnFlag || "").toLowerCase();
  const returnDescription = row.ReturnDescription;
  const toPhoneNumber=row.ShipToPhone;
  const fromPhoneNumber=row.ShipFromPhone;
  const returnShipmethod=row.ReturnShipMethod;
  const dropOffType=row.DropOffType;
  const packagingType=row.Packaging;
  const labelDeliveryMethod=row.LabelDeliveryMethod;
  if (returnShipment === "yes" || returnShipment === "y") {
    console.log("Selecting Return Shipment"); 
    if(carrierCheck.includes("fedex") || carrierCheck.includes("federal express")|| carrierCheck.includes("fdxg")){
      await packageoptions.selectReturnShipmentFedex();
      await packageoptions.selectFedexCustomsType("OTHER")
      await packageoptions.enterReturnShipmentDescription("Test Return Shipment");
      if(returnShipmethod?.trim()){
        await packageoptions.selectReturnShipMethod(returnShipmethod);
        await packageoptions.selectReturnDropOffType(dropOffType);
        await page.waitForTimeout(2000);
        await packageoptions.selectReturnPackageType(packagingType);
      }
      await packageoptions.enterPhoneNumber(fromPhoneNumber,toPhoneNumber);
      await page.waitForTimeout(2000);
      await packageoptions.saveFedexPackageOptions();
      console.log("Fedex Return shipment selected.");
    }else if(carrierCheck.includes("ups")){
      await packageoptions.selectReturnShipmentUps(); 
       if(returnShipmethod?.trim()){
        await packageoptions.selectReturnShipMethod(returnShipmethod);
      }   
      await packageoptions.enterReturnShipmentDescription("Test Return Shipment");
      await packageoptions.selectLabelDeliveryMethod(labelDeliveryMethod);     
      await packageoptions.enterPhoneNumber(fromPhoneNumber,toPhoneNumber);

      await page.waitForTimeout(5000);
      await packageoptions.saveUpsPackageOptions();
      console.log("UPS Return shipment selected.");
    }
  }

  //COD Handling
  const codFlag = (row.CODFlag || "").toLowerCase();
  const codAmount = row.CODAmount;
  const codFundsType = row.CODFundsType;
  const codCurrencyCode = row.CODCurrencyCode;
  if ((codFlag === "yes" || codFlag === "y") && carrierCheck.includes("ups")) {
    console.log("Selecting COD Option");
    await packageoptions.selectUpsCod();
    await packageoptions.enterUpsCodAmount(codAmount);
    await packageoptions.selectUpsCodType();
    await packageoptions.selectUpsFundsCode(codFundsType);
    await packageoptions.selectUpsCodCurrencyCode(codCurrencyCode);
    await packageoptions.saveUpsPackageOptions();
    console.log("UPS COD option selected.");
  }   

  //Dry Ice Handling
  const dryIceFlag = (row.DryIceFlag || "").toLowerCase();
  const dryIceWeight = row.DryIceWeight;
  const dryIceWeightUnits = row.DryIceWeightUnits;
  const medicalIndicator=(row.MedicalIndicator || "").toLowerCase();
  const regulationSet=row.RegulationSet;
  if (dryIceFlag === "yes" || dryIceFlag === "y") {
    console.log("Selecting Dry Ice Option");
    await packageoptions.dryIce();
    if(carrierCheck.includes("fedex") || carrierCheck.includes("federal express")|| carrierCheck.includes("fdxg")){
      await packageoptions.enterFedexDryIceWeight(dryIceWeight);
      await packageoptions.selectFedexDryIceWeightUnits(dryIceWeightUnits);
      await packageoptions.saveFedexPackageOptions();
    }else if(carrierCheck.includes("ups")){
      await packageoptions.enterUpsDryIceWeight(dryIceWeight);
      await packageoptions.selectUpsDryIceWeightUnits(dryIceWeightUnits);
      if(medicalIndicator==="yes" || medicalIndicator==="y"){
        await packageoptions.selectMedicalIndicator();
      }
      if(regulationSet?.trim()){
        await packageoptions.selectRegulationSet(regulationSet);
      }
      await packageoptions.saveUpsPackageOptions();
    }
  }

  //Signature Option Handling
  const signatureOptionFlag=(row.SignatureOptionFlag || "").toLowerCase();
  const signatureOption = (row.SignatureOption || "").toLowerCase();
  if ((signatureOptionFlag === "yes" || signatureOptionFlag === "y") && (carrierCheck.includes("fedex") || carrierCheck.includes("federal express") || carrierCheck.includes("fdxg"))) {
    console.log("Selecting Signature Option");
    await packageoptions.selectSignatureOption();
    if(signatureOption==="direct"){
      await packageoptions.selectDirectSignatureOption();
    }else if(signatureOption==="adult"){
      await packageoptions.selectAdultSignatureOption();
    }else if(signatureOption==="indirect"){
      await packageoptions.selectIndirectSignatureOption();
    } else if(signatureOption==="no signature"){
      await packageoptions.selectDeliveryWithoutSignatureOption();
    }else{
      console.log("Invalid Signature Option specified: "+ signatureOption);
    }
    await packageoptions.saveFedexPackageOptions();
    console.log("Fedex Signature option selected.");  
  }


}

export async function handlingMultiPackageHazmat(page, row, carrierCheck, numberOfPackages) {

  const hazmatid = row.HazMatId;
  const multiHazmat = (row.MultiHazmatFlag || "").toLowerCase();
  const numberOfHazmats = row.NumberOfHazmats;
  const labelType = row.DotLabelType;
  const idnumber = row.IdentificationNumber;
  const weight = row.HazmatWeight;
  const units = row.HazmatUnit;
  const hazmatPackagesStr = (row.HazmatPackages || "").toString().trim();
  const hazmatPackageIndices = hazmatPackagesStr
    ? hazmatPackagesStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
    : [];

  for (let i = 2; i <= numberOfPackages + 1; i++) {
    if (hazmatPackageIndices.length > 0 && !hazmatPackageIndices.includes(i)) {
      console.log(`Package ${i} is non-hazmat, unchecking hazmat checkbox`);
      const packageoptions = new PackageOption(page);
      await packageoptions.openPackageOptions(i);
      await packageoptions.unselectHazardousMaterial();
      if (carrierCheck.includes("fedex") || carrierCheck.includes("federal express") || carrierCheck.includes("fdxg")) {
        await packageoptions.unselectSignatureOption();
        await packageoptions.saveFedexPackageOptions();
      } else if (carrierCheck.includes("ups")) {
        await packageoptions.saveUpsPackageOptions();
      } else if (carrierCheck.includes("dhl")) {
        await packageoptions.saveDhlPackageOptions();
      }
      continue;
    }
    console.log(`Handling hazmat for package ${i}`);
    const packageoptions = new PackageOption(page);
    await packageoptions.openPackageOptions(i);
    await packageoptions.selectHazardousMaterial();

    if (carrierCheck.includes("fedex") || carrierCheck.includes("federal express") || carrierCheck.includes("fdxg")) {
      await packageoptions.selectFedexHazmatId(hazmatid);
      await page.waitForTimeout(5000);
      await packageoptions.addThisCommodityItem();
      if (multiHazmat === "yes" || multiHazmat === "y") {
        console.log("Adding multiple Hazmat items: " + numberOfHazmats);
        if (!(carrierCheck.includes("fdxg"))) {
          await packageoptions.selectOverpack();
        }
        for (let j = 0; j < numberOfHazmats; j++) {
          await packageoptions.selectFedexHazmatId("UN3090"); // resets dropdown state first due to application bug
          await packageoptions.selectFedexHazmatId(hazmatid);
          await page.waitForTimeout(5000);
          await packageoptions.addThisCommodityItem();
        }
      }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      await packageoptions.saveFedexPackageOptions();
      console.log(`FedEx Hazmat details saved for package ${i}.`);

    } else if (carrierCheck.includes("ups")) {
      await packageoptions.selectUpsHazmatId(hazmatid);
      await page.waitForTimeout(5000);
      await packageoptions.addThisCommodityItem();
      if (multiHazmat === "yes" || multiHazmat === "y") {
        console.log("Adding multiple Hazmat items: " + numberOfHazmats);
        await packageoptions.selectOverpack();
        await page.waitForTimeout(2000);
        for (let j = 0; j < numberOfHazmats; j++) {
          await packageoptions.selectUpsHazmatId(hazmatid);
          await page.waitForTimeout(5000);
          await packageoptions.addThisCommodityItem();
          await page.waitForTimeout(2000);
        }
      }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      await packageoptions.saveUpsPackageOptions();
      console.log(`UPS Hazmat details saved for package ${i}.`);

    } else if (carrierCheck.includes("dhl")) {
      await packageoptions.selectDhlContentId(hazmatid);
      await packageoptions.selectDhlLabelDescription(labelType, i);
      await packageoptions.enterDhlUnid(idnumber, i);
      await packageoptions.enterDhlUnitWeight(weight, i);
      await packageoptions.selectDhlUom(units, i);
      await page.waitForTimeout(5000);
      await packageoptions.selectDhlAddThisCommodityItem();
      if (multiHazmat === "yes" || multiHazmat === "y") {
        console.log("Adding multiple Hazmat items: " + numberOfHazmats);
        for (let j = 0; j < numberOfHazmats; j++) {
          await packageoptions.selectDhlContentId(hazmatid);
          await packageoptions.selectDhlLabelDescription(labelType, i);
          await packageoptions.enterDhlUnid(idnumber, i);
          await packageoptions.enterDhlUnitWeight(weight, i);
          await packageoptions.selectDhlUom(units, i);
          await page.waitForTimeout(5000);
          await packageoptions.selectDhlAddThisCommodityItem();
        }
      }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      await packageoptions.saveDhlPackageOptions();
      console.log(`DHL Hazmat details saved for package ${i}.`);
    }
  }
}

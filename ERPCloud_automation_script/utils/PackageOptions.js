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
  console.log("Hazmat Value: "+ hazmat);
  if (hazmat === "yes" || hazmat === "y") {
    console.log("Entering Hazmat Details");
    await packageoptions.selectHazardousMaterial();
    if(carrierCheck.includes("fedex") || carrierCheck.includes("federal express")|| carrierCheck.includes("fdxg")){
      await packageoptions.selectFedexHazmatId(hazmatid);
      //await packageoptions.selectFedexHazmatMaterialType(hazardousMaterialType);
      //await packageoptions.selectClass(classType);
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
      //await packageoptions.selectHazmatRegulationSet(regulationSetValue);
      await page.waitForTimeout(5000);
      await packageoptions.addThisCommodityItem();
      if(multiHazmat==="yes" || multiHazmat==="y"){
        console.log("Adding multiple Hazmat items: "+ numberOfHazmats);
        if(!(carrierCheck.includes("fdxg"))){
        await packageoptions.selectOverpack();
      }
        for(let i=0;i<numberOfHazmats;i++){
          await packageoptions.selectFedexHazmatId("UN3090");
         await packageoptions.selectFedexHazmatId(hazmatid);
          //await packageoptions.selectFedexHazmatMaterialType(hazardousMaterialType);
          //await packageoptions.selectClass(classType);
          // await packageoptions.enterHazmatWeight(weight);
          // await packageoptions.selectUnit(units);
          // await packageoptions.enterIdentificationNumber(idnumber);
          // await packageoptions.enterDotLabelType(labelType);
          // await packageoptions.enterEmergencyContactName(emergencyContactName);
          // await packageoptions.enterEmergencyContact(emergencyContactNumber);
          //await packageoptions.selectPackagingGroup(packagingGroup);
          // await packageoptions.enterPackagingCount(packagingCount);
          // await packageoptions.enterPackagingUnit(packagingUnits);
          // await packageoptions.enterTechnicalName(technicalName);
          //await packageoptions.enterSignatureName(signatureName);
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
      await packageoptions.addThisCommodityItem();

      await page.waitForLoadState('networkidle');
      await packageoptions.saveUpsPackageOptions();
      console.log("UPS Hazmat details saved.");
    }

  }

  //Return Shipment Handling
  const returnShipment = (row.ReturnFlag || "").toLowerCase();
  const returnDescription = row.ReturnDescription;
  const toPhoneNumber=row.ShipToPhone;
  const fromPhoneNumber=row.ShipFromPhone;
  const returnShipmethod=row.ReturnShipMethod;
  if (returnShipment === "yes" || returnShipment === "y") {
    console.log("Selecting Return Shipment"); 
    if(carrierCheck.includes("fedex") || carrierCheck.includes("federal express")|| carrierCheck.includes("fdxg")){
      await packageoptions.selectReturnShipmentFedex();
      if(returnShipmethod?.trim()){
        await packageoptions.selectReturnShipMethod(returnShipmethod);
      }
      await packageoptions.enterPhoneNumber(fromPhoneNumber,toPhoneNumber);
    
      await page.waitForTimeout(5000);
      await packageoptions.saveFedexPackageOptions();
      console.log("Fedex Return shipment selected.");
    }else if(carrierCheck.includes("ups")){
      await packageoptions.selectReturnShipmentUps(); 
       if(returnShipmethod?.trim()){
        await packageoptions.selectReturnShipMethod(returnShipmethod);
      }   
      await packageoptions.enterReturnShipmentDescription(returnDescription);     
      await packageoptions.enterPhoneNumber(fromPhoneNumber,toPhoneNumber);
      await packageoptions.saveUpsPackageOptions();
      console.log("UPS Return shipment selected.");
    }
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
  if (signatureOptionFlag === "yes" || signatureOptionFlag === "y"&& (carrierCheck.includes("fedex") || carrierCheck.includes("federal express")|| carrierCheck.includes("fdxg"))) {
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

  //COD Handling
  const codFlag = (row.CodFlag || row.CODFlag || "").toLowerCase();
  const codAmount = row.CodAmount || row.CODAmount;
  if (codFlag === "yes" || codFlag === "y") {
    console.log("Selecting COD Option");
    if (carrierCheck.includes("fedex") || carrierCheck.includes("federal express") || carrierCheck.includes("fdxg")) {
      await packageoptions.codOption();
      if (codAmount) {
        await packageoptions.enterCodAmount(codAmount);
      }
      await packageoptions.saveFedexPackageOptions();
      console.log("FedEx COD option selected.");
    } else if (carrierCheck.includes("ups")) {
      await packageoptions.selectUpsCod();
      if (codAmount) {
        await packageoptions.enterUpsCodAmount(codAmount);
      }
      await packageoptions.saveUpsPackageOptions();
      console.log("UPS COD option selected.");
    }
  }
}

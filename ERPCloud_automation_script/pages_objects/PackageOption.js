exports.PackageOption = class PackageOption {
  constructor(page) {
    this.page = page;
    this.packageoptions = page.locator('#packOptID1');

  }

    async openPackageOptions(){
      const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.packageoptions.click(),
      ]);

      await newPage.waitForLoadState();
      this.packagePage = newPage;

    //hazmat locators
    this.hazardousMaterial = this.packagePage.locator('#HazardousMaterial');
    this.fedexHazMatId = this.packagePage.locator('#fedexHazardousMaterialID');
    this.fedexHazmatMaterialType=this.packagePage.locator('#fedexHazardousMaterialTypeID');
    this.classitem=this.packagePage.locator('#ClassWidth');
    this.identificationNumber=this.packagePage.locator('#fedexHazMatIdentificationNoID');
    this.weight=this.packagePage.locator('#fedexHazardousMaterialQuantityID');
    this.unit=this.packagePage.locator('#fedexHazardousMaterialUnitID');
    this.dotLabelType=this.packagePage.locator('#fedexHazMatDOTLabelTypeID');
    this.emergencyContact=this.packagePage.locator('#fedexHazMatEmergencyContactNoID');
    this.emergencyContactName=this.packagePage.locator('#fedexHazMatEmergencyContactNameID');
    this.packagingGroup=this.packagePage.locator('#fedexHazardousMaterialPkgGroupID');
    this.packagingCount=this.packagePage.locator('#fedexHazMatPackagingCntID');
    this.packagingUnit=this.packagePage.locator('#fedexHazMatPackagingUnitsID');
    this.technicalName=this.packagePage.locator('#fedexHazMatTechnicalNameID');
    this.signatureName=this.packagePage.locator('#fedexHazMatSignatureNameID');
    this.packingInstruction=this.packagePage.locator('#HazMatPackInstructionsID');
    this.hazmatOption=this.packagePage.locator('#fedexHazmatOptionsID');
    this.cargoAircraftOnly=this.packagePage.locator('#HazMatCargoAircraftID');
    this.hazmatAuthorization=this.packagePage.locator('#HazMatAuthorizationID');
    this.hazmatRegulationSet=this.packagePage.locator('#HazMatRegulationSetID');
    this.hazmatQuantityType=this.packagePage.locator('#HazMatQuantityUnitTypeID');
    this.upsHazMatId = this.packagePage.locator('#HazMatMaterialId');
    this.addCommodityItem = this.packagePage.locator("#addCommID");
    this.commodityLineSelect = this.packagePage.locator('#commodityLine');
    this.overpack= this.packagePage.locator('#HazMatOverPackFlag');
    //return shipment locators
    this.returnshipmentFedex = this.packagePage.locator('#fedexReturnShipmentID');
    this.returnShipMethod=this.packagePage.locator('#rtnShipMethodID');
    this.returnShipFromNumber=this.packagePage.locator('#rtnShipFromPhoneID');
    this.returnShipToNumber=this.packagePage.locator('#rtnShipToPhoneID');
    this.returnshipmentUps = this.packagePage.locator('#returnShipmentID');
    this.returnShipmentDescription=this.packagePage.locator('#returnDescriptionID');
    //buttons locators
    this.savebtnInFedexPackageOptions = this.packagePage.locator("#fedexTopSaveButtonEnableID");
    this.savebtnInUpsPackageOptions = this.packagePage.locator("#upsSaveButtonID");
    this.closebtnInFedexPackageOptions = this.packagePage.locator("#fedexTopCloseButtonEnableID");
    this.closebtnInUpsPackageOptions = this.packagePage.locator("#closeButton");
    //signature options locators
    this.signatureOption = this.packagePage.locator('#fedexSignatureOptionCheckID');
    this.directSignatureOption = this.packagePage.locator('#fedexsignatureOptionDIRECT');
    this.adultSignatureOption = this.packagePage.locator('#fedexsignatureOptionADULT');
    this.deliveryWithoutSignatureOption = this.packagePage.locator('#fedexsignatureOptionDELIVERWITHOUTSIGNATURE');
    this.indirectSignatureOption = this.packagePage.locator('#fedexsignatureOptionINDIRECT');
    //cod locators
    this.cod=this.packagePage.locator('#chCOD');
    this.codAmount=this.packagePage.locator('#codAmt2');
    this.surCharge=this.packagePage.locator('#fedexPackageSurchargeID');
    this.shipmentCost=this.packagePage.locator('#fedexPackageShipmentCostID');
    this.upsCod=this.packagePage.locator('#AascUPSHazmatPackageAction_upsCodCheckBox');
    this.upsCodAmount=this.packagePage.locator('#AascUPSHazmatPackageAction_upsCodAmt');
    this.upsSignatureOption=this.packagePage.locator('#upsDelConfirmID');
    this.upsLargePackage=this.packagePage.locator('#AascUPSHazmatPackageAction_upsLargePackageCheckBox');
    this.upsAdditionalHandling=this.packagePage.locator('#AascUPSHazmatPackageAction_upsAddlHandlingCheckBox');
    //dry ice locators
    this.dryice=this.packagePage.locator('#chDryIce');
    this.fedexDryiceWeight=this.packagePage.locator('#fedexDryIceWeightID');
    this.upsDryiceWeight=this.packagePage.locator('#upsDryIceWeightID');
    this.fedexDryiceWeightUnits=this.packagePage.locator('#fedexDryIceUnitsID');
    this.upsDryiceWeightUnits=this.packagePage.locator('#upsDryIceUnitsID');
    this.regulationSet=this.packagePage.locator('#dryIceRegulationSetID');
    this.medicalIndicator=this.packagePage.locator('#medicalIndicatorId');
    this.holdAtLocation=this.packagePage.locator('#holdAtLocation');
    
    //smartpost
    this.fedexIndiciaType=this.packagePage.locator('#fedexIndiciaTypeSelectID');
    this.fedexAncillaryEndorsementType=this.packagePage.locator('#fedexAncillaryEndorsementSelectID');
  }

    async openDgForm(){
        await this.DgformView.click();
    }

    
    async selectHazardousMaterial(){ 
      if (!(await this.hazardousMaterial.isChecked())){
        await this.hazardousMaterial.check();
      }
      
    } 

    async selectFedexHazmatId(hazmatid){
      await this.fedexHazMatId.waitFor();
      await this.fedexHazMatId.selectOption(hazmatid); 
    }

    async selectFedexHazmatMaterialType(materialType){
      await this.fedexHazmatMaterialType.waitFor();
      await this.fedexHazmatMaterialType.selectOption(materialType); 
    }

    async selectClass(classValue){
      await this.classitem.waitFor();
      await this.classitem.selectOption(classValue); 
    }

    async enterHazmatWeight(weight){
      await this.weight.waitFor();
      await this.weight.fill(String(weight));
    }

    async selectUnit(unit){
      await this.unit.waitFor();
      await this.unit.selectOption(unit); 
    }

    async enterIdentificationNumber(idNumber){
      await this.identificationNumber.waitFor();
      await this.identificationNumber.fill(String(idNumber));
    }

    async enterDotLabelType(labelType){
      await this.dotLabelType.waitFor();
      await this.dotLabelType.fill(labelType); 
    }

    async enterEmergencyContact(emergencyContactNumber){
      await this.emergencyContact.waitFor();
      await this.emergencyContact.fill(emergencyContactNumber);
    }

    async enterEmergencyContactName(emergencyContactName){
      await this.emergencyContactName.waitFor();
      await this.emergencyContactName.fill(String(emergencyContactName));
    }


    async selectPackagingGroup(packagingGroup){
      await this.packagingGroup.waitFor();
      await this.packagingGroup.selectOption(packagingGroup); 
    }

    async enterPackagingCount(count){
      await this.packagingCount.waitFor();
      await this.packagingCount.fill(String(count));
    }

    async enterPackagingUnit(unit){
      await this.packagingUnit.waitFor();
      await this.packagingUnit.fill(unit);
    }

    async enterSignatureName(name){
      await this.signatureName.waitFor();
      await this.signatureName.fill(name);
    }
    
    async enterTechnicalName(name){
      await this.technicalName.waitFor();
      await this.technicalName.fill(name);
    }

    async enterPackingInstruction(packingInstructionValue){
      await this.packingInstruction.waitFor();
      await this.packingInstruction.fill(String(packingInstructionValue));
    }

    async enterAuthorization(hazmatAuthorization){
      await this.hazmatAuthorization.waitFor();
      await this.hazmatAuthorization.fill(hazmatAuthorization);
    }

    async selectCargoAircraftOnly(cargoAircraft){
      await this.cargoAircraftOnly.waitFor();
      await this.cargoAircraftOnly.selectOption(cargoAircraft);
    }

    async selectHazmatRegulationSet(regulationSet){
      await this.hazmatRegulationSet.waitFor();
      await this.hazmatRegulationSet.selectOption(String(regulationSet) ); 
    }

    async selectHazmatOption(option){
      await this.hazmatOption.waitFor();
      await this.hazmatOption.selectOption(option); 
    }

    async selectHazmatQuantityType(quantityType){
      await this.hazmatQuantityType.waitFor();
      await this.hazmatQuantityType.selectOption(quantityType); 
    }

    async selectUpsHazmatId(hazmatid){
      await this.upsHazMatId.waitFor();
      await this.upsHazMatId.click();
      await this.upsHazMatId.selectOption(hazmatid); 
    }
   

    async addThisCommodityItem(){
      await this.addCommodityItem.waitFor({ state: 'visible' });
      await this.addCommodityItem.click();
    }

    async saveFedexPackageOptions(){
      await this.savebtnInFedexPackageOptions.click();
    }

    async closeFedexPackageOptions(){
      await this.closebtnInFedexPackageOptions.click();
    }

    async saveUpsPackageOptions(){
      await this.savebtnInUpsPackageOptions.click();
    }

    async closeUpsPackageOptions(){
      await this.closebtnInUpsPackageOptions.click();
    }

    async selectOverpack(){
      await this.overpack.click();
    }

  
    async selectReturnShipmentFedex(){
      if (!(await this.returnshipmentFedex.isChecked())){
        await this.returnshipmentFedex.check();
      }
    }

    async selectReturnShipmentUps(){
      await this.returnshipmentUps.click();
      if (!(await this.returnshipmentUps.isChecked())){
        await this.returnshipmentUps.check();
      }
    }

    async selectReturnShipMethod(rtnShipmethod){
      await this.returnShipMethod.selectOption(rtnShipmethod);
    }

    async enterReturnShipmentDescription(description){
      await this.returnShipmentDescription.fill(description);
    }

    async enterPhoneNumber(fromNumber,toNumber){
      await this.returnShipFromNumber.fill(String(fromNumber));
      await this.returnShipToNumber.fill(String(toNumber));
    } 

    async selectSignatureOption(){
       if (!(await this.signatureOption.isChecked())){
        await this.signatureOption.check();
      }
    }

    async selectDirectSignatureOption(){
      await this.directSignatureOption.click();
    }

    async selectAdultSignatureOption(){
      await this.adultSignatureOption.click();
    }

    async selectDeliveryWithoutSignatureOption(){
      await this.deliveryWithoutSignatureOption.click();
    } 
    
    async selectIndirectSignatureOption(){
      await this.indirectSignatureOption.click();
    }

    async dryIce(){
      if (!(await this.dryice.isChecked())){  
        await this.dryice.check();
      }
    }

    async enterFedexDryIceWeight(weight){
      await this.fedexDryiceWeight.fill(String(weight));
    }

    async selectFedexDryIceWeightUnits(units){
      await this.fedexDryiceWeightUnits.selectOption(units);
    }

    async enterUpsDryIceWeight(weight){
      await this.upsDryiceWeight.fill(String(weight));
    }

    async selectUpsDryIceWeightUnits(units){
      await this.upsDryiceWeightUnits.selectOption(units);
    }

    async selectRegulationSet(regulation){
      await this.regulationSet.selectOption(regulation);
    }

    async selectMedicalIndicator(){
      if (!(await this.medicalIndicator.isChecked())){    
        await this.medicalIndicator.check();
      }
    }

    async codOption(){
      if (!(await this.cod.isChecked())){
        await this.cod.check();
      }
    }

    async enterCodAmount(amount){
      await this.codAmount.fill(String(amount));
    }

    async selectUpsCod(){
      if (!(await this.upsCod.isChecked())){
        await this.upsCod.check();
      }
    }

    async enterUpsCodAmount(amount){
      await this.upsCodAmount.fill(String(amount));
    }

    async fedexIndiciaTypeSelectID(indiciaType){
      await this.fedexIndiciaType.selectOption(indiciaType);
    }

    async fedexAncillaryEndorsementSelectID(endorsementType){
      await this.fedexAncillaryEndorsementType.selectOption(endorsementType); 
    }

    
    

  }
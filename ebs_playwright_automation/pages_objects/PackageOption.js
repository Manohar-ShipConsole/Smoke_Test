
//// This is the PackageOptions.js Code which is under the pages_objects


export class PackageOption {
  constructor(page) {
    this.page = page;

  }

    async openPackageOptions(index = 1){
      const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.locator(`#packOptID${index}:visible`).click(),
      ]);

      await newPage.waitForLoadState();
      this.packagePage = newPage;



    //hazmat locators
    this.hazardousMaterial = this.packagePage.locator('#HazardousMaterial');
    this.fedexHazMatId = this.packagePage.locator('#fedexHazardousMaterialID');
    this.fedexHazmatMaterialType=this.packagePage.locator('#fedexHazardousMaterialTypeID');
    this.classitem=this.packagePage.locator('#ClassWidth');
    this.identificationNumber=this.packagePage.locator('#fedexHazMatIdentificationNoID');
    this.unit=this.packagePage.locator('#fedexHazardousMaterialUnitID');
    this.fedexCustomsType=this.packagePage.locator('#AascHazmatPackageAction_customsOptionsType');
    this.packagingGroup=this.packagePage.locator('#fedexHazardousMaterialPkgGroupID');
    this.upsHazMatId = this.packagePage.locator('#HazMatMaterialId');
    this.addCommodityItem = this.packagePage.locator("#addCommID");
    this.commodityLineSelect = this.packagePage.locator('#commodityLine');
    this.overpack= this.packagePage.locator('#HazMatOverPackFlag');
    this.dhlContentId=this.packagePage.locator('#dgContentIdID');
    this.dhlAddthisCommodityItem=this.packagePage.locator('//*[@name="addComm"]');
    this.dhlLabelDescription=this.packagePage.locator('#dgLabelDescriptionID1');
    this.dhlUnid=this.packagePage.locator('#dgUnCodeID1');
    this.dhlUnitWeight=this.packagePage.locator('#dgUnitWeightID1');
    this.dhlUom=this.packagePage.locator('#dgUomID1');
    //return shipment locators
    this.returnshipmentFedex = this.packagePage.locator('#fedexReturnShipmentID');
    this.returnDropOffType=this.packagePage.locator('#rtnDropOfTypeID');
    this.returnPackageType=this.packagePage.locator('#rtnPackageListID');
    this.returnShipMethod=this.packagePage.locator('#rtnShipMethodID');
    this.returnShipFromNumber=this.packagePage.locator('#rtnShipFromPhoneID');
    this.returnShipToNumber=this.packagePage.locator('#rtnShipToPhoneID');
    this.returnshipmentUps = this.packagePage.locator('#returnShipmentID');
    this.returnShipmentDescription=this.packagePage.locator('#returnDescriptionID');
    this.labelDeliveryMethod=this.packagePage.locator('#labelDeliveryMethodID');
    //buttons locators
    this.savebtnInFedexPackageOptions = this.packagePage.locator("#fedexTopSaveButtonEnableID");
    this.savebtnInUpsPackageOptions= this.packagePage.locator('(//*[@id="upsSaveButtonID"])[1]');
    this.savebthnInDhlPackageOptions= this.packagePage.locator('#topSaveButtnID');
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
    this.upsCodType=this.packagePage.locator('#AascUPSHazmatPackageAction_upsCodCode');
    this.upsFunds=this.packagePage.locator('#AascUPSHazmatPackageAction_upsCodFundsCode');
    this.upsCodCurrencyCode=this.packagePage.locator('#upsCodCurrCodeID');
    this.upsPackaging=this.packagePage.locator('#AascUPSHazmatPackageAction_upsPackaging');
    this.upsDeliveryConfirmation=this.packagePage.locator('#upsDelConfirmID');
    this.upsPackageSurcharge=this.packagePage.locator('#AascUPSHazmatPackageAction_pkgSurCharge');
    this.upsLargePackage=this.packagePage.locator('#AascUPSHazmatPackageAction_upsLargePackageCheckBox');
    this.upsAdditionalHandling=this.packagePage.locator('#AascUPSHazmatPackageAction_upsAddlHandlingCheckBox');
    this.upsBillDeclaredValueCharges=this.packagePage.locator('#AascUPSHazmatPackageAction_declaredValToShipper');
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

    //hazmat auto-populated fields
    this.hazmatWeight           = this.packagePage.locator('#fedexHazardousMaterialQuantityID');
    this.emergencyContactName   = this.packagePage.locator('#fedexHazMatEmergencyContactNameID');
    this.emergencyContactNumber = this.packagePage.locator('#fedexHazMatEmergencyContactNoID');
    this.packagingCount         = this.packagePage.locator('#fedexHazMatPackagingCntID');
    this.packagingUnits         = this.packagePage.locator('#fedexHazMatPackagingUnitsID');
    this.technicalName          = this.packagePage.locator('#fedexHazMatTechnicalNameID');
    this.signatureName          = this.packagePage.locator('#fedexHazMatSignatureNameID');
    this.packingInstructions    = this.packagePage.locator('#HazMatPackInstructionsID');
  }

    
    async selectHazardousMaterial(){
      if (!(await this.hazardousMaterial.isChecked())){
        await this.hazardousMaterial.check();
      }
    }

    async unselectHazardousMaterial(){
      if (await this.hazardousMaterial.isChecked()){
        await this.hazardousMaterial.uncheck();
      }
    }

    async unselectSignatureOption(){
      if (await this.signatureOption.isChecked()){
        await this.signatureOption.uncheck();
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

    async selectUnit(unit){
      await this.unit.waitFor();
      await this.unit.selectOption(unit); 
    }


    async selectClass(classValue){
      await this.classitem.waitFor();
      await this.classitem.selectOption(classValue); 
    }

    async enterIdentificationNumber(idnumber){
      await this.identificationNumber.waitFor();
      await this.identificationNumber.fill(idnumber); 
    }

    async selectPackagingGroup(packagingGroup){
      await this.packagingGroup.waitFor();
      await this.packagingGroup.selectOption(packagingGroup); 
    }

    async selectUpsHazmatId(hazmatid){
      await this.upsHazMatId.waitFor();
      await this.upsHazMatId.selectOption(hazmatid); 
    }

    async addThisCommodityItem(){
      await this.addCommodityItem.waitFor({ state: 'visible' });
      await this.addCommodityItem.click();
    }

        async selectDhlContentId(contentId){
      await this.dhlContentId.waitFor();
      await this.dhlContentId.selectOption(String(contentId)); 
    }

    async selectDhlLabelDescription(labelDescription, index = 1){
      const loc = this.packagePage.locator(`#dgLabelDescriptionID${index}`);
      await loc.waitFor();
      await loc.selectOption(labelDescription);
    }

    async enterDhlUnid(unid, index = 1){
      const loc = this.packagePage.locator(`#dgUnCodeID${index}`);
      await loc.waitFor();
      await loc.fill(String(unid));
    }

    async enterDhlUnitWeight(weight, index = 1){
      const loc = this.packagePage.locator(`#dgUnitWeightID${index}`);
      await loc.waitFor();
      await loc.fill(String(weight));
    }

    async selectDhlUom(uom, index = 1){
      const loc = this.packagePage.locator(`#dgUomID${index}`);
      await loc.waitFor();
      await loc.selectOption(uom);
    }

    async selectDhlAddThisCommodityItem(){
      await this.dhlAddthisCommodityItem.waitFor({ state: 'visible' });
      await this.dhlAddthisCommodityItem.click();
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

    async saveDhlPackageOptions(){
      await this.savebthnInDhlPackageOptions.click();
    }

    async selectOverpack(){
      if (!(await this.overpack.isChecked())){
        await this.overpack.check();
      }
    }

    async selectReturnShipmentFedex(){
      if (!(await this.returnshipmentFedex.isChecked())){
        await this.returnshipmentFedex.check();
      }
    }

    async selectReturnShipmentUps(){
      if (!(await this.returnshipmentUps.isChecked())){
        await this.returnshipmentUps.check();
      }
    }

    async selectReturnShipMethod(rtnShipmethod){
      await this.returnShipMethod.selectOption(rtnShipmethod);
    }

    
    async selectReturnDropOffType(dropOffType){
      await this.returnDropOffType.selectOption(dropOffType);
    }
    
    async selectReturnPackageType(packageType){
      await this.returnPackageType.selectOption(packageType);
    }

    async selectFedexCustomsType(customsType){
      await this.fedexCustomsType.selectOption(customsType);
    }

    async enterReturnShipmentDescription(description){
      await this.returnShipmentDescription.fill(description);
    }

    async selectLabelDeliveryMethod(method){
      await this.labelDeliveryMethod.selectOption(method);
    }

    async selectPackaging(packaging){
      await this.upsPackaging.selectOption(packaging);
    }

    async selectUpsDeliveryConfirmation(deliveryConfirmation){
      await this.upsDeliveryConfirmation.selectOption(deliveryConfirmation);
    }

    async selectLargePackage(){
      if (!(await this.upsLargePackage.isChecked())){
        await this.upsLargePackage.check();
      }
    }

    async selectAdditionalHandling(){
      if (!(await this.upsAdditionalHandling.isChecked())){
        await this.upsAdditionalHandling.check();
      }
    }

    async selectBillDeclaredValueCharges(){
      if (!(await this.upsBillDeclaredValueCharges.isChecked())){
        await this.upsBillDeclaredValueCharges.check();
      } 
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

    async selectUpsCod(){
      if (!(await this.upsCod.isChecked())){
        await this.upsCod.check();
      }
    }

    async enterUpsCodAmount(amount){
      await this.upsCodAmount.fill(amount);
    }

    async selectUpsCodType(){
      await this.upsCodType.selectOption("TAGLESS_COD");
    }

    async selectUpsFundsCode(fundsCode){
      await this.upsFunds.selectOption(fundsCode);
    }

    async selectUpsCodCurrencyCode(currencyCode){
      await this.upsCodCurrencyCode.selectOption(currencyCode);
    }

    async enterCodAmount(amount){
      await this.codAmount.fill(amount);
    }

    async fedexIndiciaTypeSelectID(indiciaType){
      await this.fedexIndiciaType.selectOption(indiciaType);
    }

    async fedexAncillaryEndorsementSelectID(endorsementType){
      await this.fedexAncillaryEndorsementType.selectOption(endorsementType); 
    }

    //===========GETTERS =================================================

    async getFedexHazmatIdText()      { return await this.fedexHazMatId.evaluate(el => el.options[el.selectedIndex]?.text || ''); }
    async getUpsHazmatIdText()        { return await this.upsHazMatId.evaluate(el => el.options[el.selectedIndex]?.text || ''); }
    async getClassText()              { return await this.classitem.evaluate(el => el.options[el.selectedIndex]?.text || ''); }
    async getUnitText()               { return await this.unit.evaluate(el => el.options[el.selectedIndex]?.text || ''); }
    async getPackagingGroupText()     { return await this.packagingGroup.evaluate(el => el.options[el.selectedIndex]?.text || ''); }
    async getIdentificationNumber()   { return await this.identificationNumber.inputValue(); }
    async getHazmatWeight()           { return await this.hazmatWeight.inputValue(); }
    async getEmergencyContactName()   { return await this.emergencyContactName.inputValue(); }
    async getEmergencyContactNumber() { return await this.emergencyContactNumber.inputValue(); }
    async getPackagingCount()         { return await this.packagingCount.inputValue(); }
    async getPackagingUnits()         { return await this.packagingUnits.inputValue(); }
    async getTechnicalName()          { return await this.technicalName.inputValue(); }
    async getSignatureName()          { return await this.signatureName.inputValue(); }
    async getPackingInstructions()    { return await this.packingInstructions.inputValue(); }
    async getDhlUnidValue()           { return await this.dhlUnid.inputValue(); }
    async getDhlUnitWeightValue()     { return await this.dhlUnitWeight.inputValue(); }
    async closePopup()                { await this.packagePage.close(); }

  }
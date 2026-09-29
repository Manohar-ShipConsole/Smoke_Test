export class FreightDetails{

    constructor(page) {
        this.page = page;
        this.freightDetailsLink = page.locator('#FedexFreightLink');
    }

    async openFreightDetails() {
        await this.freightDetailsLink.waitFor();
        const [freightPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.freightDetailsLink.click()
        ]);
        await freightPage.waitForLoadState();
        this.initLocators(freightPage);
    }

    useDirectPage() {
        this.initLocators(this.page);
    }

    initLocators(targetPage) {
        this.freightDetailsPage = targetPage;
        this.bolNumber     = targetPage.locator('#BolnoID1');
        this.poNumber      = targetPage.locator('#PonoID1');
        this.handlingUnits = targetPage.locator('#HandlingUnitsID1');
        this.packagingType = targetPage.locator('#PackagingTypesID1');
        this.pieces        = targetPage.locator('#PiecesID1');
        this.class         = targetPage.locator('#ClassID1');
        this.weight        = targetPage.locator('#weightFFID1');
        this.weightUOM     = targetPage.locator('#uomFFID1');
        this.length        = targetPage.locator('#LineLengthID1');
        this.width         = targetPage.locator('#LineWidthID1');
        this.height        = targetPage.locator('#LineHeightID1');
        this.dimensionsUOM = targetPage.locator('#LineDimUomID1');
        this.hazmat        = targetPage.locator('#HMID1');
        this.NMFC          = targetPage.locator('#NMFCID1');
        this.volume        = targetPage.locator('#VolumeID1');
        this.volumeUnits   = targetPage.locator('#volumeUnitsID1');
        this.description   = targetPage.locator('#DescriptionID1');
        this.addButton     = targetPage.locator('#AddButton');
        this.removeButton  = targetPage.locator('#RemoveButton');
        this.saveButton    = targetPage.locator('#saveButtonID').first();
        this.closeButton   = targetPage.locator('#closeButtonID').first();
    }

    async enterHandlingUnits(hUnit) {
        await this.handlingUnits.waitFor();
        await this.handlingUnits.fill(String(hUnit));
    }

    async enterPONumber(poNumber) {
        await this.poNumber.waitFor();
        await this.poNumber.fill(String(poNumber));
    }

    async enterBOLNumber(bolNumber) {
        await this.bolNumber.waitFor();
        await this.bolNumber.fill(String(bolNumber));
    }

    async selectPackagingType(packagingType) {
        await this.packagingType.waitFor();
        await this.packagingType.selectOption(packagingType);
    }

    async enterPieces(numberOfPieces) {
        await this.pieces.waitFor();
        await this.pieces.fill(String(numberOfPieces));
    }

    async selectClass(classValue) {
        await this.class.waitFor();
        await this.class.selectOption(String(classValue));
    }

    async enterWeight(weight, weightUOM) {
        await this.weight.waitFor();
        await this.weight.fill(String(weight));
        await this.weightUOM.selectOption(weightUOM);
    }

    async enterDimensions(length, width, height, dimensionsUOM) {
        await this.length.waitFor();
        await this.length.fill(String(length));
        await this.width.waitFor();
        await this.width.fill(String(width));
        await this.height.waitFor();
        await this.height.fill(String(height));
        await this.dimensionsUOM.selectOption(dimensionsUOM);
    }

    async enableHazmat(){
        await this.hazmat.waitFor();
        if(!(await this.hazmat.isChecked())) {
            await this.hazmat.check();
        }
    }

    async enterNMFC(nmfc) {
        await this.NMFC.waitFor();
        await this.NMFC.fill(String(nmfc));
    }

    async enterVolume(volume, volumeUnits) {
        await this.volume.waitFor();
        await this.volume.fill(String(volume));
        await this.volumeUnits.selectOption(volumeUnits);
    }

    async enterDescription() {
        const text = "Random Info " + Math.floor(Math.random() * 100000);
        await this.description.waitFor();
        await this.description.fill(text);
    }

    async saveChanges() {
        await this.saveButton.waitFor();
        await this.saveButton.click();
    }   

    async closeChanges() {
        await this.closeButton.waitFor();
        await this.closeButton.click();
    }

}

const fs = require('fs');
const path = require('path');
const { pdfToText } = require('../utils/pdfReader.js');
const { validateFiles } = require('../utils/validations.js');


exports.Documents = class Documents {

    constructor(page) {
        this.page = page;
        this.viewlabel =page.locator('#AascButtonViewLabelID'); // Shipping page View Label Button

    }

        async openViewLabelPopup(){
        const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        this.viewlabel.click(),
        ]);

        await newPage.waitForLoadState();
        this.viewLabelPopup = newPage;



        this.returnTrackingNumber = this.viewLabelPopup.locator("#rtnTrackingNo1");
        this.documents=this.viewLabelPopup.locator("//button[normalize-space()='View']/parent::td");
    }

    async getReturnTrackingNumber(){
        const trackingNumber = await this.returnTrackingNumber.getAttribute('value');
        this.viewLabelPopup.close();
        return `${trackingNumber}_Return`;
    }


    async pdfHandling(testInfo){

        const documentFiles=await this.documents.all();

        let downloadedFiles=[];

        for(const doc of documentFiles){
            const [pdfPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            doc.click(),
        ]);

        await pdfPage.waitForLoadState();

        const pdfUrl = pdfPage.url();

        const extractedValue = new URL(pdfUrl).searchParams.get("labelName");
        const labelName = extractedValue.replace('.pdf', '');
        await pdfPage.waitForLoadState('networkidle'); 

        const response = await this.page.context().request.get(pdfUrl);

        const outDir = path.resolve(process.cwd(), 'downloads');
         if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

         if(pdfUrl.endsWith('PDF')){
            const pdfContent = await response.body();
            const pdfPath= path.join(outDir, `${labelName}.pdf`);
            const txtPath = path.join(outDir, `${labelName}.txt`);
            const extractedText = await pdfToText(pdfContent);
            fs.writeFileSync(pdfPath, pdfContent);
            fs.writeFileSync(txtPath, extractedText);
            downloadedFiles.push(pdfPath, txtPath);
            await testInfo.attach(`${labelName}.pdf`, {
                path: pdfPath,
            });
            await testInfo.attach(`${labelName}.txt`, {
                path: txtPath,
            });
            await validateFiles(this.page,row,extractedText,labelName);

         }
        await pdfPage.close();
          
        }

    }

    async closeViewLabelPopup(){
        await this.viewLabelPopup.close();
    }

    


}

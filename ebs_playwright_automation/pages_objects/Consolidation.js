export class Consolidation{

    constructor(page) {
        this.page = page;
        this.consolidationTab =page.locator('#ConsolidationID'); 

    }

    async openConsolidation() {
        await this.consolidationTab.waitFor();

        const [consolidationWindow] = await Promise.all([
        this.page.context().waitForEvent('page'),
        this.consolidationTab.click()
        ]);

        await consolidationWindow.waitForLoadState();
        this.consolidation = consolidationWindow;

        this.consolidation.on('dialog', async dialog => {
            console.log('Consolidation dialog:', dialog.message());
            await dialog.accept();
        });

        this.consolidationButton= this.consolidation.locator('#consolidateSubmit');
        this.consolidationClose=this.consolidation.locator('#consolidateClose');
        this.consolidationDelete=this.consolidation.locator('#consolidateDelete');
        this.statusMessage=this.consolidation.locator('.displayMessage');

    }

    async consolidate(){
        await this.consolidationButton.waitFor();
        await this.consolidationButton.click();
    }

    async closeConsolidation(){
        await this.consolidationClose.waitFor();
        await this.consolidationClose.click();
    }

    async deleteConsolidation(){
        await this.consolidationDelete.waitFor();
        await this.consolidationDelete.click();
    }

    async clearAllExistingRows() {
        let anyChecked = false;
        let index = 1;

        while (true) {
            const checkbox = this.consolidation.locator(`#chDelID${index}`);
            const exists = await checkbox.count();
            if (exists === 0) break;

            if (!await checkbox.isChecked()) {
                await checkbox.click();
            }
            anyChecked = true;
            index++;
        }

        if (anyChecked) {
            await this.consolidationDelete.click();
            await this.consolidation.waitForTimeout(500);
        }
    }

    async deleteExtraRows(enteredCount) {
        let anyChecked = false;
        let index = enteredCount + 1;

        while (true) {
            const checkbox = this.consolidation.locator(`#chDelID${index}`);
            const exists = await checkbox.count();
            if (exists === 0) break;

            if (!await checkbox.isChecked()) {
                await checkbox.click();
            }
            anyChecked = true;
            index++;
        }

        if (anyChecked) {
            await this.consolidationDelete.click();
            await this.consolidation.waitForTimeout(500);
        }
    }

    async enterDeliveryId(deliveryId, index, isLast = false) {
        const input = this.consolidation.locator(`#childDelNoID${index}`);
        await input.waitFor();
        await input.fill(String(deliveryId));
        if (!isLast) {
            await input.press('Enter');
            await this.consolidation.waitForTimeout(500);
        }
    }


    async allStatusesValid(totalRows) {
        await this.consolidation.waitForTimeout(2000);
        const validCount = await this.statusMessage.filter({ hasText: /Valid/ }).count();
        console.log("Valid statuses found:", validCount);
        return validCount >= totalRows;
    }

    async allStatusesLabelPrinted(totalRows) {
        await this.consolidation.waitForTimeout(2000);
        const count = await this.statusMessage.filter({ hasText: /Label Printed/i }).count();
        console.log("LabelPrinted statuses found:", count);
        return count >= totalRows;
    }



}
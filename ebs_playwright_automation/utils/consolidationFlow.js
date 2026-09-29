import { Consolidation } from '../pages_objects/Consolidation.js';

export async function handleConsolidation(page, row) {
    const consolidationDeliveries = (row.ConsolidationDeliveries || "").toString().trim();
    if (!consolidationDeliveries) return;

    const deliveries = consolidationDeliveries.split(',').map(d => d.trim()).filter(d => d);
    if (deliveries.length === 0) return;

    const consolidation = new Consolidation(page);
    await consolidation.openConsolidation();

    // Clear any pre-existing rows so we start fresh with only our deliveries
    await consolidation.clearAllExistingRows();

    for (let i = 0; i < deliveries.length; i++) {
        const isLast = i === deliveries.length - 1;
        await consolidation.enterDeliveryId(deliveries[i], i + 1, isLast);
    }

    // Delete all extra rows beyond the ones we entered (app may pre-populate rows)
    await consolidation.deleteExtraRows(deliveries.length);

    await consolidation.consolidate();

    const totalRows = deliveries.length;
    const allValid = await consolidation.allStatusesValid(totalRows);
    if (allValid) {
        console.log("All deliveries consolidated successfully");
    } else {
        console.log("Some deliveries failed consolidation - check Status column");
    }

    await consolidation.closeConsolidation();
}

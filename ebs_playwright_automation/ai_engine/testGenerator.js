// ============================================================
// FILE: ai_engine/testGenerator.js
// USAGE: node ai_engine/testGenerator.js
// PURPOSE: Reads ManualTestCases.xlsx and uses Claude AI to
//          generate ONLY the unique test steps per test case.
//          Common steps (login, delivery, ship) are skipped
//          since they already exist in Shipping.test.js.
//          One .test.js file is generated per test case and
//          saved to tests/ai_generated/ for review.
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callClaude } from '../utils/apiClient.js';
import { readExcelSync } from '../utils/excelReader.js';
import aiConfig from './ai.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── CONFIG ──────────────────────────────────────────────────
const EXCEL_FILE  = 'ManualTestCases.xlsx';
const SHEET_NAME  = 'Sheet1';
const OUTPUT_DIR  = path.resolve(__dirname, '../ai_generated/test_cases');

// ─── COMMON STEPS TO SKIP ────────────────────────────────────
// These already exist in Shipping.test.js — Claude will skip them
const COMMON_STEPS = `
The following steps ALREADY EXIST in Shipping.test.js.
DO NOT generate code for these — skip them completely:

1. Login with credentials          → login.loginWithCredentials()
2. Navigate to Shipping Page       → index.clickShipping()
3. Enter Delivery ID + Search      → shipping.enterdeliveryid() + clickdeliverysearchbtn()
4. Select Ship Method              → shipping.selectShipMethod()
5. Select Drop Off Type            → shipping.clickonDropOffTypebtn()
6. Select Pay Method               → shipping.selectpayMethod()
7. Enter Account Number            → shipping.enterAccountNumber()
8. Enter Weight                    → shipping.enterWeight()
9. Enter Phone + Contact Name      → shipping.enterPhoneNumber() + enterContactName()
10. Enter Dimensions               → shipping.openDimensionPopup() + enterDimensions() + saveDimensions()
11. Select Printer                 → shipping.selectPrinter()
12. Select Shipment Date           → shipping.selectShipmentDate()
13. Click Ship                     → shipping.clickShip()
14. Get Ship Message               → shipping.getMessage()
15. Get Tracking Number            → shipping.waybillNumber.getAttribute('value')
16. Open Label                     → openLabelInNewTab()
17. Void Shipment                  → shipping.voidShipment()
`;

// ─── FRAMEWORK CONTEXT ───────────────────────────────────────
// Tells Claude exactly what page classes and methods are available
const FRAMEWORK_CONTEXT = `
FRAMEWORK: Playwright + JavaScript (ESM) + Page Object Model

PAGE CLASSES AVAILABLE (already imported in Shipping.test.js):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ShippingPage → pages_objects/ShippingPage.js
   Key methods:
   - clickMore()
   - addPackages(n)
   - editDestinationAddress() / closeDestinationAddress()
   - enterAddressLine1/2/3()
   - getMessage() → returns success/void message
   - waybillNumber → locator for tracking number

2. InternationalPage → pages_objects/InternationalPage.js
   Key methods:
   - openInternationalPage()
   - clickOnCommodity()
   - clickEditCommodity()
   - editCommodityForceUpdate({ description, countryOfManufacture, hsCode, quantity, unit, customsValue, licenseNumber })
   - saveCommodity()
   - setTermsOfSale(terms)
   - setFreightCharge(value)
   - setInsuranceCharge(value)
   - setTaxesOrMiscCharge(value)
   - setPurpose(purpose)
   - setRelatedCompanies(value)
   - getBillDutiesTo()
   - getBillingAccountNumber()
   - getImporterName/CompanyName/Phone/City/State/PostalCode/Country()
   - intlPagesave()
   - intlpageclose()
   - viewCIDocument(testInfo)
   - viewUSCODocument(testInfo)

3. PackageOption → pages_objects/PackageOption.js
   Key methods:
   - openPackageOptions()
   - selectHazardousMaterial()
   - selectFedexHazmatId(hazmatid)
   - selectFedexHazmatMaterialType(type)
   - selectUpsHazmatId(hazmatid)
   - selectDhlContentId(id)
   - addThisCommodityItem()
   - selectDhlAddThisCommodityItem()
   - selectOverpack()
   - dryIce()
   - enterFedexDryIceWeight(w) / selectFedexDryIceWeightUnits(u)
   - enterUpsDryIceWeight(w) / selectUpsDryIceWeightUnits(u)
   - selectMedicalIndicator()
   - selectRegulationSet(r)
   - codOption() / enterCodAmount(a)
   - selectUpsCod() / enterUpsCodAmount(a) / selectUpsCodType()
   - selectReturnShipmentFedex() / selectReturnShipmentUps()
   - selectReturnShipMethod(m) / selectReturnDropOffType(t) / selectReturnPackageType(t)
   - enterReturnShipmentDescription(d)
   - selectLabelDeliveryMethod(m)
   - enterPhoneNumber(from, to)
   - selectSignatureOption()
   - selectDirectSignatureOption() / selectAdultSignatureOption()
   - selectIndirectSignatureOption() / selectDeliveryWithoutSignatureOption()
   - saveFedexPackageOptions()
   - saveUpsPackageOptions()
   - saveDhlPackageOptions()
   - fedexIndiciaTypeSelectID(type)
   - fedexAncillaryEndorsementSelectID(type)

4. Documents → pages_objects/Documents.js
   Key methods:
   - openViewLabelPopup()
   - getReturnTrackingNumber()
   - closeViewLabelPopup()
   - pdfHandling(testInfo)

UTILITY HELPERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- internationalShippingFlow(page, row, shippingPage) → utils/internationalShippingFlow.js
- handlingPackageOptions(page, row, carrierCheck)    → utils/PackageOptions.js
- openLabelInNewTab(page, row, request, trackingNum, labelType) → utils/labelHandler.js
- checkQZPrint(trackingNumber)                       → utils/qzReader.js

CARRIER DETECTION (from row.ShipMethod or TestCaseName):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- FedEx → carrierCheck.includes("fedex") || carrierCheck.includes("federal express")
- UPS   → carrierCheck.includes("ups")
- DHL   → carrierCheck.includes("dhl")

VARIABLES AVAILABLE INSIDE Shipping.test.js test block:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- page, request, testInfo  ← Playwright fixtures
- shipping                 ← ShippingPage instance
- carrierCheck             ← row.ShipMethod.toLowerCase()
- row                      ← current Excel row data
- trackingNumberValue      ← waybill number after ship
`;

// ─── BUILD PROMPT FOR ONE TEST CASE ──────────────────────────
function buildPrompt(row) {
  return `
You are an expert Playwright test automation engineer.

Your job is to generate ONLY the UNIQUE test steps for the following manual test case.
The common steps already exist in Shipping.test.js — do NOT generate them.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEST CASE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Case ID   : ${row['TestCaseID'] || row['Test Case ID'] || 'Unknown'}
Module         : ${row['Module'] || 'Unknown'}
Test Case Name : ${row['TestCaseName'] || row['Test Case Name'] || 'Unknown'}
Test Steps     : 
${row['TestSteps'] || row['Test Steps'] || 'No steps provided'}

Expected Result: 
${row['ExpectedResult'] || row['Expected Result'] || 'No expected result provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEPS TO SKIP (already in Shipping.test.js):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${COMMON_STEPS}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAMEWORK CONTEXT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${FRAMEWORK_CONTEXT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Read the Test Steps carefully
2. SKIP any step that already exists in Shipping.test.js (listed above)
3. Generate ONLY the unique steps that are NOT in Shipping.test.js
4. Use the correct page class methods from the framework context above
5. Use expect.soft() for non-critical assertions
6. Use expect() for critical assertions from ExpectedResult
7. Add a comment above each unique step explaining what it does
8. The generated code should be ready to COPY and PASTE into Shipping.test.js
9. Wrap the unique code in a clear comment block showing where to paste it
10. Use ESM syntax (import/export) — no require()
11. Output ONLY the JavaScript code — no markdown, no explanation, no code fences

FORMAT YOUR OUTPUT EXACTLY LIKE THIS:
// ─── UNIQUE STEPS FOR ${row['TestCaseID'] || row['Test Case ID']} - ${row['TestCaseName'] || row['Test Case Name']} ───
// 📋 PASTE THIS inside Shipping.test.js → inside the test() block
// 📋 Place it AFTER: await shipping.saveDimensions();
// 📋 Place it BEFORE: await shipping.selectPrinter(config.printerName);

// [your unique generated code here]

// ─── END OF UNIQUE STEPS ───────────────────────────────────
`;
}

// ─── SAVE GENERATED TEST FILE ────────────────────────────────
function saveGeneratedTest(testCaseId, code) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created: ${OUTPUT_DIR}`);
  }

  // Clean any accidental markdown fences
  const cleaned = code
    .replace(/^```(?:javascript|js)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  const fileName  = `${testCaseId}.test.js`;
  const filePath  = path.join(OUTPUT_DIR, fileName);
  fs.writeFileSync(filePath, cleaned, 'utf8');

  return filePath;
}

// ─── PRINT SUMMARY ───────────────────────────────────────────
function printSummary(rows) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('MANUAL TEST CASES SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Total test cases : ${rows.length}`);
  rows.forEach((r, i) => {
    const id   = r['TestCaseID']    || r['Test Case ID']   || `Row_${i + 1}`;
    const name = r['TestCaseName']  || r['Test Case Name'] || 'Unknown';
    console.log(`   ${i + 1}. ${id} → ${name}`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// ─── MAIN ─────────────────────────────────────────────────────
async function main() {
  console.log('\n AI TEST GENERATOR');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 1. Read ManualTestCases.xlsx
  console.log(`Reading: ${EXCEL_FILE} → ${SHEET_NAME}`);
  const rows = readExcelSync(EXCEL_FILE, SHEET_NAME);
  console.log(`   Found ${rows.length} test case(s)\n`);

  if (rows.length === 0) {
    console.error('No test cases found in Excel. Please check the file.');
    process.exit(1);
  }

  // 2. Print summary
  printSummary(rows);

  // 3. Process each test case one by one
  const results = [];

  for (let i = 0; i < rows.length; i++) {
    const row      = rows[i];
    const testId   = row['TestCaseID']   || row['Test Case ID']   || `TC_${String(i + 1).padStart(2, '0')}`;
    const testName = row['TestCaseName'] || row['Test Case Name'] || 'Unknown';

    console.log(`\n[${i + 1}/${rows.length}] Processing: ${testId} → ${testName}`);
    console.log(`Sending to Claude AI...`);

    try {
      // 4. Build prompt for this test case
      const prompt = buildPrompt(row);

      // 5. Call Claude AI
      const generatedCode = await callClaude(prompt);

      // 6. Save to tests/ai_generated/TC_01.test.js
      const savedPath = saveGeneratedTest(testId, generatedCode);

      console.log(`Saved → ${savedPath}`);
      results.push({ testId, testName, status: 'success', path: savedPath });

    } catch (err) {
      console.error(`Failed: ${err.message}`);
      results.push({ testId, testName, status: 'failed', error: err.message });
    }
  }

  // 7. Final summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('GENERATION COMPLETE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const success = results.filter(r => r.status === 'success');
  const failed  = results.filter(r => r.status === 'failed');

  console.log(`Generated : ${success.length} test(s)`);
  console.log(`Failed    : ${failed.length} test(s)`);
  console.log(`\nReview generated files in: tests/ai_generated/`);
  console.log(`Copy unique steps → paste into Shipping.test.js`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
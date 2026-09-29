import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { readExcelSync } from './excelReader.js';

const PULSE_DIR   = path.resolve('pulse-report');
const PULSE_JSON  = path.join(PULSE_DIR, 'playwright-pulse-report.json');
const OUT_DIR     = path.resolve('customer-report');
const OUT_FILE    = path.join(OUT_DIR, 'ShipConsole_Automation_Report.xlsx');

const FONT_NAME   = 'Arial';
const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
const HEADER_FONT = { name: FONT_NAME, bold: true, color: { argb: 'FFFFFFFF' } };
const BODY_FONT   = { name: FONT_NAME };
const PASS_FONT   = { name: FONT_NAME, bold: true, color: { argb: 'FF008000' } };
const FAIL_FONT   = { name: FONT_NAME, bold: true, color: { argb: 'FFCC0000' } };
const LINK_FONT   = { name: FONT_NAME, color: { argb: 'FF0563C1' }, underline: true };

function stripAnsi(str = '') {
  return str.replace(/\[[0-9;]*m/g, '');
}

function detectCarrier(shipMethod = '') {
  const s = shipMethod.toLowerCase();
  if (s.includes('fxfr')) return 'FXFR';
  if (s.includes('fdxg')) return 'FDXG';
  if (s.includes('fedex') || s.includes('federal express')) return 'FDXE';
  if (s.includes('ups')) return 'UPS';
  if (s.includes('dhl')) return 'DHL';
  if (s.includes('usps')) return 'USPS';
  return 'OTHER';
}

function formatDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  return `${Math.floor(totalSec / 60)}:${String(totalSec % 60).padStart(2, '0')}`;
}

function loadPulseResults() {
  const report = JSON.parse(fs.readFileSync(PULSE_JSON, 'utf8'));
  return report.results || [];
}

function loadDeliveryData() {
  const rows = readExcelSync('ShippingData_EBS.xlsx', 'Sheet1');
  const byTestCase = new Map();
  for (const row of rows) byTestCase.set(String(row.TestCase).trim(), row);
  return byTestCase;
}

function extractTestCase(name) {
  const match = name.match(/Test case:\s*(.+)/);
  return (match ? match[1] : name).trim();
}

// screenshots/videoPath/attachments in pulse JSON are relative to pulse-report/, not the repo root
function resolveEvidencePath(relPath) {
  if (!relPath) return null;
  const abs = path.resolve(PULSE_DIR, relPath);
  if (!fs.existsSync(abs)) return null;
  return path.relative(OUT_DIR, abs).replace(/\\/g, '/');
}

// Priority: "Shipment Confirmation" (captured right after the success message, before any
// later Void step reloads the page) -> "Failure Screenshot" (captured in afterEach at the
// exact moment a failed test stopped) -> Playwright's automatic end-of-test screenshot ->
// video -> error-context. Ensures the linked evidence shows the actual result/failure point,
// not whatever the page happened to be mid-transition to at teardown.
function resolveEvidence(r) {
  // A test can capture several "Shipment Confirmation" shots (initial ship, MPS batches,
  // post-shipment packages) — the last one is the truest final state.
  const confirmations = r.attachments?.filter(a => a.name === 'Shipment Confirmation') || [];
  const confirmation = confirmations[confirmations.length - 1];
  const confirmationPath = resolveEvidencePath(confirmation?.path);
  if (confirmationPath) return { path: confirmationPath, label: 'Screenshot' };

  const failure = r.attachments?.find(a => a.name === 'Failure Screenshot');
  const failurePath = resolveEvidencePath(failure?.path);
  if (failurePath) return { path: failurePath, label: 'Screenshot (failure point)' };

  const screenshot = resolveEvidencePath(r.screenshots?.[0]);
  if (screenshot) return { path: screenshot, label: 'Screenshot (end of test)' };

  const video = resolveEvidencePath(r.videoPath?.[r.videoPath.length - 1]);
  if (video) return { path: video, label: 'Video' };

  const errorContext = r.attachments?.find(a => a.name === 'error-context');
  const errorContextPath = resolveEvidencePath(errorContext?.path);
  if (errorContextPath) return { path: errorContextPath, label: 'Error Context' };

  return null;
}

function extractTestSteps(r) {
  const steps = [];
  const stdout = (r.stdout || []).join('');

  // Core steps that happen in all tests
  steps.push('1. Login to the application');
  steps.push('2. Navigate to shipping page');
  steps.push('3. Retrieve the delivery');
  steps.push('4. Select ship method, enter weight and dimensions');
  steps.push('5. Enter contact and address information');

  // Conditional steps based on test execution
  if (stdout.includes('International')) {
    steps.push('6. Configure international shipment details');
  }

  if (stdout.includes('Package Options') || stdout.includes('PackageOptions')) {
    steps.push('6. Handle package options');
  }

  if (stdout.includes('MPS') || stdout.includes('batch')) {
    steps.push('7. Add multiple packages');
  }

  // Ship step
  steps.push(r.status === 'passed' ? '8. Click on Ship - Success' : '8. Click on Ship - Failed');

  // Post-ship steps
  if (r.status === 'passed') {
    if (stdout.includes('Validating') || stdout.includes('validation')) {
      steps.push('9. Validate label');
    }
    if (stdout.includes('Void') || stdout.includes('RETURNS')) {
      steps.push('10. Void the delivery');
    }
  }

  return steps.join('\n');
}

function buildRows(results, deliveryByTestCase) {
  return results.map(r => {
    const testCase = extractTestCase(r.name);
    const delivery = deliveryByTestCase.get(testCase) || {};
    const evidence = resolveEvidence(r);
    return {
      testCase,
      deliveryId: delivery.DeliveryID || '',
      shipMethod: delivery.ShipMethod || '',
      carrier: detectCarrier(delivery.ShipMethod || ''),
      status: r.status.toUpperCase(),
      duration: formatDuration(r.duration),
      testSteps: extractTestSteps(r),
      evidencePath: evidence?.path || null,
      evidenceLabel: evidence?.label || null,
      console: stripAnsi((r.stdout || []).join('')).slice(0, 1500),
      error: stripAnsi(r.errorMessage || ''),
    };
  });
}

function styleHeader(sheet, ncols) {
  const row = sheet.getRow(1);
  for (let c = 1; c <= ncols; c++) {
    row.getCell(c).font = HEADER_FONT;
    row.getCell(c).fill = HEADER_FILL;
  }
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
}

function addDataSheet(workbook, rows) {
  const sheet = workbook.addWorksheet('Data');
  sheet.columns = [
    { header: 'Delivery ID', key: 'deliveryId', width: 14 },
    { header: 'Test Case', key: 'testCase', width: 42 },
    { header: 'Ship Method', key: 'shipMethod', width: 42 },
    { header: 'Carrier', key: 'carrier', width: 10 },
    { header: 'Status', key: 'status', width: 10 },
    { header: 'Test Steps', key: 'testSteps', width: 50 },
  ];
  for (const r of rows) {
    const row = sheet.addRow(r);
    row.getCell('status').font = r.status === 'PASSED' ? PASS_FONT : FAIL_FONT;
    for (const key of ['deliveryId', 'testCase', 'shipMethod', 'carrier', 'testSteps']) row.getCell(key).font = BODY_FONT;
    row.getCell('testSteps').alignment = { wrapText: true, vertical: 'top' };
  }
  styleHeader(sheet, 6);
}

function addCarrierSheet(workbook, carrier, rows) {
  const sheet = workbook.addWorksheet(carrier);
  sheet.columns = [
    { header: 'Test Case', key: 'testCase', width: 40 },
    { header: 'Delivery ID', key: 'deliveryId', width: 12 },
    { header: 'Status', key: 'status', width: 10 },
    { header: 'Time Taken', key: 'duration', width: 12 },
    { header: 'Test Steps', key: 'testSteps', width: 50 },
    { header: 'Evidence', key: 'screenshot', width: 10 },
    { header: 'Console Log', key: 'console', width: 60 },
    { header: 'Error', key: 'error', width: 45 },
  ];
  for (const r of rows) {
    const row = sheet.addRow(r);
    row.getCell('status').font = r.status === 'PASSED' ? PASS_FONT : FAIL_FONT;
    for (const key of ['testCase', 'deliveryId', 'duration', 'testSteps', 'console', 'error']) row.getCell(key).font = BODY_FONT;

    // Keep the hyperlink's visible text short ("Open") so the whole clickable run stays inside
    // the column width — a long label here gets clipped and the clipped part isn't clickable.
    const linkCell = row.getCell('screenshot');
    if (r.evidencePath) {
      linkCell.value = { text: 'Open', hyperlink: r.evidencePath };
      linkCell.font = LINK_FONT;
    } else {
      linkCell.value = 'N/A';
      linkCell.font = BODY_FONT;
    }

    // Excel bottom-aligns cells by default. Console Log/Error wrap to many lines and stretch
    // the row tall, which would otherwise sink the "Open" link to the bottom of that tall row —
    // top-align every cell in the row so the link stays where you'd expect to click it.
    row.getCell('testCase').alignment = { vertical: 'top' };
    row.getCell('deliveryId').alignment = { vertical: 'top' };
    row.getCell('status').alignment = { vertical: 'top' };
    row.getCell('duration').alignment = { vertical: 'top', horizontal: 'center' };
    row.getCell('testSteps').alignment = { wrapText: true, vertical: 'top' };
    linkCell.alignment = { vertical: 'top', horizontal: 'center' };
    row.getCell('console').alignment = { wrapText: true, vertical: 'top' };
    row.getCell('error').alignment = { wrapText: true, vertical: 'top' };
  }
  styleHeader(sheet, 8);
}

function addSummarySheet(workbook, rowsByCarrier) {
  const sheet = workbook.addWorksheet('Summary');
  sheet.columns = [
    { header: 'Carrier', key: 'carrier', width: 14 },
    { header: 'Total', key: 'total', width: 10 },
    { header: 'Passed', key: 'passed', width: 10 },
    { header: 'Failed', key: 'failed', width: 10 },
    { header: 'Pass %', key: 'passPct', width: 10 },
  ];
  const carriers = Object.keys(rowsByCarrier);
  carriers.forEach((carrier, i) => {
    const r = i + 2;
    sheet.getCell(`A${r}`).value = carrier;
    sheet.getCell(`B${r}`).value = { formula: `COUNTA(${carrier}!A2:A1000)` };
    sheet.getCell(`C${r}`).value = { formula: `COUNTIF(${carrier}!C:C,"PASSED")` };
    sheet.getCell(`D${r}`).value = { formula: `COUNTIF(${carrier}!C:C,"FAILED")` };
    sheet.getCell(`E${r}`).value = { formula: `IFERROR(C${r}/B${r},0)` };
    sheet.getCell(`E${r}`).numFmt = '0.0%';
  });
  const totalRow = carriers.length + 2;
  sheet.getCell(`A${totalRow}`).value = 'TOTAL';
  sheet.getCell(`A${totalRow}`).font = { name: FONT_NAME, bold: true };
  sheet.getCell(`B${totalRow}`).value = { formula: `SUM(B2:B${totalRow - 1})` };
  sheet.getCell(`C${totalRow}`).value = { formula: `SUM(C2:C${totalRow - 1})` };
  sheet.getCell(`D${totalRow}`).value = { formula: `SUM(D2:D${totalRow - 1})` };
  sheet.getCell(`E${totalRow}`).value = { formula: `IFERROR(C${totalRow}/B${totalRow},0)` };
  sheet.getCell(`E${totalRow}`).numFmt = '0.0%';
  styleHeader(sheet, 5);
}

async function generateEvidencePDFs(results) {
  const EVIDENCE_DIR = path.resolve('customer-report/evidence');
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const pdfPaths = {};

  for (const r of results) {
    const testName = extractTestCase(r.name);
    const safeFilename = testName.replace(/[^a-z0-9]/gi, '_').substring(0, 60);
    const pdfPath = path.join(EVIDENCE_DIR, `${safeFilename}.pdf`);

    // Remove old PDF if it exists
    try {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    } catch (err) {
      console.log(`Warning: could not remove old PDF ${safeFilename}.pdf: ${err.message}`);
    }

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text('Test Evidence Report', { underline: true });
    doc.fontSize(10).font('Helvetica');
    doc.text(`Test Case: ${testName}`);
    doc.text(`Status: ${r.status.toUpperCase()}`);
    doc.text(`Duration: ${formatDuration(r.duration)}`);
    doc.text(`Executed: ${new Date(r.endTime).toLocaleString()}`);
    doc.moveDown();

    // Separate attachments: Labels vs Evidence (Screenshots)
    const attachments = r.attachments || [];
    const labelAttachments = attachments.filter(a => a.name.toLowerCase().startsWith('label-'));
    const evidenceAttachments = attachments.filter(a => !a.name.toLowerCase().startsWith('label-'));
    const hasScreenshots = evidenceAttachments.length > 0 || (r.screenshots && r.screenshots.length > 0);

    // Screenshots section with clickable links
    if (hasScreenshots) {
      doc.fontSize(12).font('Helvetica-Bold').text('Screenshots:', { underline: true });
      doc.fontSize(10).font('Helvetica');

      let screenshotCount = 0;

      // Show captured evidence attachments with clickable links
      for (const attachment of evidenceAttachments) {
        const attachPath = attachment.path;
        const fullPath = path.resolve(PULSE_DIR, attachPath);
        if (fs.existsSync(fullPath)) {
          const relPath = path.relative(path.join(OUT_DIR, 'evidence'), fullPath).replace(/\\/g, '/');
          screenshotCount++;
          doc.text(`• screenshot-${screenshotCount} (${attachment.name})`, {
            link: relPath,
            color: '0563C1',
            underline: true
          });
        }
      }

      // Show automatic screenshots with clickable links
      if (r.screenshots && r.screenshots.length > 0) {
        for (let i = 0; i < r.screenshots.length; i++) {
          const screenshotPath = r.screenshots[i];
          const fullPath = path.resolve(PULSE_DIR, screenshotPath);
          if (fs.existsSync(fullPath)) {
            const relPath = path.relative(path.join(OUT_DIR, 'evidence'), fullPath).replace(/\\/g, '/');
            screenshotCount++;
            doc.text(`• screenshot-${screenshotCount}`, {
              link: relPath,
              color: '0563C1',
              underline: true
            });
          }
        }
      }
      doc.moveDown();
    }

    // Labels section (separate from screenshots)
    if (labelAttachments.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Labels:', { underline: true });
      doc.fontSize(10).font('Helvetica');
      for (let i = 0; i < labelAttachments.length; i++) {
        const attachment = labelAttachments[i];
        const attachPath = attachment.path;
        const fullPath = path.resolve(PULSE_DIR, attachPath);
        if (fs.existsSync(fullPath)) {
          // Use relative path: from evidence/ to ../pulse-report/attachments/...
          const relPath = path.relative(path.join(OUT_DIR, 'evidence'), fullPath).replace(/\\/g, '/');
          doc.text(`• label-${i + 1}`, { link: relPath, color: '0563C1', underline: true });
        }
      }
      doc.moveDown();
    }

    // Videos with clickable links
    if (r.videoPath && r.videoPath.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Videos:', { underline: true });
      doc.fontSize(10).font('Helvetica');
      for (let i = 0; i < r.videoPath.length; i++) {
        const videoPath = r.videoPath[i];
        const fullPath = path.resolve(PULSE_DIR, videoPath);
        if (fs.existsSync(fullPath)) {
          // Use relative path: from evidence/ to ../pulse-report/videos/...
          const relPath = path.relative(path.join(OUT_DIR, 'evidence'), fullPath).replace(/\\/g, '/');
          doc.text(`• video-${i + 1}`, { link: relPath, color: '0563C1', underline: true });
        }
      }
      doc.moveDown();
    }

    // Console Output
    if (r.stdout && r.stdout.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Console Output:', { underline: true });
      doc.fontSize(8).font('Courier');
      const consoleText = stripAnsi(r.stdout.join(''));
      doc.text(consoleText, { lineGap: 2 });
      doc.moveDown();
    }

    // Error Message
    if (r.status === 'failed' && r.errorMessage) {
      doc.fontSize(12).font('Helvetica-Bold').text('Error Message:', { underline: true });
      doc.fontSize(9).font('Courier');
      const errorText = stripAnsi(r.errorMessage);
      doc.text(errorText);
    }

    doc.end();
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    pdfPaths[testName] = `${safeFilename}.pdf`;
  }

  return pdfPaths;
}

export async function generateCustomerReport() {
  const results = loadPulseResults();
  const deliveryByTestCase = loadDeliveryData();

  // Generate evidence PDFs first
  const pdfPaths = await generateEvidencePDFs(results);

  // Build rows with PDF links instead of screenshot links
  const rows = results.map(r => {
    const testCase = extractTestCase(r.name);
    const delivery = deliveryByTestCase.get(testCase) || {};
    const pdfPath = pdfPaths[testCase];

    return {
      testCase,
      deliveryId: delivery.DeliveryID || '',
      shipMethod: delivery.ShipMethod || '',
      carrier: detectCarrier(delivery.ShipMethod || ''),
      status: r.status.toUpperCase(),
      duration: formatDuration(r.duration),
      testSteps: extractTestSteps(r),
      // Use relative path for shareability: ./evidence/filename.pdf works from anywhere
      evidencePath: pdfPath ? `./evidence/${pdfPath}` : null,
      evidenceLabel: pdfPath ? 'Evidence of Testing' : null,
      console: stripAnsi((r.stdout || []).join('')).slice(0, 1500),
      error: stripAnsi(r.errorMessage || ''),
    };
  });

  const rowsByCarrier = {};
  for (const r of rows) (rowsByCarrier[r.carrier] ??= []).push(r);

  const workbook = new ExcelJS.Workbook();
  addSummarySheet(workbook, rowsByCarrier);
  addDataSheet(workbook, rows);
  for (const [carrier, carrierRows] of Object.entries(rowsByCarrier)) {
    addCarrierSheet(workbook, carrier, carrierRows);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  await workbook.xlsx.writeFile(OUT_FILE);

  // Copy all evidence folders to customer-report so everything is shareable
  function copyDir(src, dest) {
    if (!fs.existsSync(src)) return; // Skip if source doesn't exist
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.mkdirSync(dest, { recursive: true });
    const files = fs.readdirSync(src);
    for (const file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // Copy all evidence folders
  const customerPulseDir = path.join(OUT_DIR, 'pulse-report');
  copyDir(PULSE_DIR, customerPulseDir);
  copyDir('test-attachments', path.join(OUT_DIR, 'test-attachments'));
  copyDir('test-results', path.join(OUT_DIR, 'test-results'));
  copyDir('downloads', path.join(OUT_DIR, 'downloads'));

  console.log(`Customer report generated: ${OUT_FILE}`);
  console.log(`Evidence PDFs generated in: ${path.join(OUT_DIR, 'evidence')}`);
  console.log(`\n📦 Complete package ready for sharing:`);
  console.log(`   - Excel report: ${OUT_FILE}`);
  console.log(`   - Evidence PDFs: ${path.join(OUT_DIR, 'evidence')}`);
  console.log(`   - Playwright Results: ${customerPulseDir}`);
  console.log(`   - Test Results: ${path.join(OUT_DIR, 'test-results')}`);
  console.log(`   - Shipment Screenshots: ${path.join(OUT_DIR, 'test-attachments')}`);
  console.log(`   - Downloaded Labels: ${path.join(OUT_DIR, 'downloads')}`);
  console.log(`\n✅ All links are relative - entire folder is shareable with customers!`);
}

generateCustomerReport();

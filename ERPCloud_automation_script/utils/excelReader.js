import XLSX from 'xlsx';
import path from 'path';

const baseDir = process.cwd();

function readExcelSync(fileName, sheetName) {
  const filePath = path.join(baseDir, 'test_data', fileName);

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  return XLSX.utils.sheet_to_json(sheet);
}

module.exports = { readExcelSync };


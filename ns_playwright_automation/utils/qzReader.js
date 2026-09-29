import fs from "fs";
import path from "path";

/**
 * Reads QZ Tray debug.log and checks if a specific label (tracking number)
 * was sent to the correct printer.
 *
 * @param {string} trackingNumber - Waybill/label number (jobName in QZ log)
 * @returns {string|null}         - Match info or null
 */
export function checkQZPrint(trackingNumber) {
  try {
    // Resolve path: C:\Users\<user>\AppData\Roaming\qz\debug.log
    const logFile = path.resolve(
      process.env.HOME || process.env.USERPROFILE,
      "AppData",
      "Roaming",
      "qz",
      "debug.log"
    );

    if (!fs.existsSync(logFile)) {
      console.log(" QZ debug.log NOT FOUND →", logFile);
      return null;
    }

    const logContent = fs.readFileSync(logFile, "utf8");
    const blocks = logContent.split("Message:");
    const normalize = (str) => str.replace(/\\+/g, "");
    const expectedPrinter = `ZDesigner ZD230-203dpi ZPL`;

    // // normalize both block and expected printer

    const normalizedPrinter = normalize(expectedPrinter);

    let lastCheckedBlock = null;

    for (const block of blocks) {
      if (!block.includes(`"call":"print"`)) continue;


    const normalizedBlock = normalize(block);

    const hasJob = normalizedBlock.includes(`"jobName":"${trackingNumber}"`);

    const hasPrinter = normalizedBlock.includes(`"name":"${normalizedPrinter}"`);

    lastCheckedBlock = block
    

    if (hasJob && hasPrinter) {
      return {
        success: true,
        message: `Matched block for job ${trackingNumber} on printer`,
        block
      };
    }
    }

      return {
        success: false,
        message: `UnMatched block for job ${trackingNumber} on printer`,
        block: lastCheckedBlock
      };

    } catch (err) {
      console.error(" Error reading QZ logs:", err);
      return null;
    }
}

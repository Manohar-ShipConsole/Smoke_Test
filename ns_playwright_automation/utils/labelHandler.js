import fs from 'fs';
import path from 'path';
import test, { expect } from '@playwright/test';
import config from '../configuration/config.js';
import { validateFiles } from './validations.js';


export async function openLabelInNewTab(page, row, request, trackingNumberValue, labelType) {

  console.log(`Opening ${labelType} label in new tab...`);

  const baseURL = config.baseURL;

  if (baseURL.includes("cloudscmtest")) {
    txtURL = `https://cloudscmtest.shipconsole.com/labels/SCNetSuite/${trackingNumberValue}`;
  } else if (baseURL.includes("scdev")) {
    txtURL = `http://scdev.shipconsole.com:8004/labels/SAAS/${trackingNumberValue}`;
  } else {
    throw new Error(`No label URL configured for baseURL: ${baseURL}`);
  }

  // Open in new tab
  if (trackingNumberValue == null || trackingNumberValue == "") {
    throw new Error(` ${labelType} tracking number is null or empty`);
  } else {
    const [newPage] = await Promise.all([
      page.context().waitForEvent("page"),
      page.evaluate((url) => {
        window.open(url, "_blank");
      }, txtURL)
    ]);


    // ---------------------------------------------------
    // DOWNLOAD TXT CONTENT
    // ---------------------------------------------------
    const response = await request.get(txtURL);
    expect(response.ok()).toBeTruthy();

    const text = await response.text();

    const outDir = path.resolve(process.cwd(), 'downloads');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    const filename = path.join(outDir, `label-${trackingNumberValue}.txt`);
    fs.writeFileSync(filename, text);



    await test.info().attach(`Label-${trackingNumberValue}.txt`, {
      path: filename,
    });

    await newPage.waitForLoadState();
    await newPage.close();
    console.log('Validations Started');

    await validateFiles(page, row, text, `label-${trackingNumberValue}`);
    console.log(`${labelType} label validations completed successfully`);
  }


}
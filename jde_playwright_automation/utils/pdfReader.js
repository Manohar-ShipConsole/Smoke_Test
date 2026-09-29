import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';


export async function pdfToText(pdfBuffer) {
    const uint8 = new Uint8Array(pdfBuffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8 });
    const pdfDoc = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
    }
    return fullText;
}

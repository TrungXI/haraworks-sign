import {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
  rgb ,
} from "pdf-lib";
import signer from "node-signpdf";
import fs from "fs";
import PDFArrayCustom from "./PDFArrayCustom";

export default class SignPDF {
  constructor(pdfFile, certFile,signatureImageFile) {
    this.pdfDoc = fs.readFileSync(pdfFile);
    this.certificate = fs.readFileSync(certFile);
    this.signatureImageFile = signatureImageFile; 
  }

  /**
   * @return Promise<Buffer>
   */
  async signPDF(password) {
    let newPDF = await this._addPlaceholder(password);
    newPDF = signer.sign(newPDF, this.certificate, {passphrase:password});

    return newPDF;
  }

  async _addPlaceholder(password) {
    const loadedPdf = await PDFDocument.load(this.pdfDoc);
    const ByteRange = PDFArrayCustom.withContext(loadedPdf.context);
    const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********';
    const SIGNATURE_LENGTH = 3322;
    const pages = loadedPdf.getPages();

    ByteRange.push(PDFNumber.of(0));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));

    const signatureDict = loadedPdf.context.obj({
      Type: 'Sig',
      Filter: 'Adobe.PPKLite',
      SubFilter: 'adbe.pkcs7.detached',
      ByteRange,
      Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
      Reason: PDFString.of('We need your signature for reasons...'),
      M: PDFString.fromDate(new Date()),
    });

    const signatureDictRef = loadedPdf.context.register(signatureDict);

    const signatureImageBytes = fs.readFileSync(this.signatureImageFile);
    const signatureImage = await loadedPdf.embedPng(signatureImageBytes);

    // Đặt vị trí chữ ký (ví dụ: top right của trang đầu tiên)
    const signatureX = 100; // Tùy chỉnh vị trí X
    const signatureY = 100; // Tùy chỉnh vị trí Y
    const imageX = 100; // Tùy chỉnh vị trí Y
    const imageY = 100; // Tùy chỉnh vị trí Y
        
    const widgetDict = loadedPdf.context.obj({
      Type: 'Annot',
      Subtype: 'Widget',
      FT: 'Sig',
      Rect:  [signatureX, signatureY, signatureX + imageX + 100, signatureY + imageY + 100], // Điều chỉnh kích thước và vị trí chữ ký
      V: signatureDictRef,
      T: PDFString.of('Haraworks'),
      F: 4,
      P: pages[0].ref,
    });
    
    const widgetDictRef = loadedPdf.context.register(widgetDict);
    const page = pages[0];
    page.drawImage(signatureImage, {
      x: signatureX + 50, // Adjust the X position as needed
      y: signatureY + 30, // Adjust the Y position as needed
      width: imageX, // Adjust the width as needed
      height: imageY, // Adjust the height as needed
    });

    page.drawText("Chung thuc boi: Haraworks",{
      x: signatureX + 10,
      y: signatureY + 150,
      size: 12,
      color: rgb(1, 0, 0), // Màu đỏ
    });
    page.drawText("Ky boi: Nguyen Binh Phuong Lam",{
      x: signatureX + 10,
      y: signatureY + 170,
      size: 12,
      color: rgb(1, 0, 0), // Màu đỏ
    });
    page.drawText("Ngay ky: 30/9/2023",{
      x: signatureX + 10,
      y: signatureY + 190,
      size: 12,
      color: rgb(1, 0, 0), // Màu đỏ
    });
    page.drawText("Nguyen Viet Trung",{
    x: signatureX + 10,
      y: signatureY + 10,
      size: 12,
      color: rgb(0, 0, 0), // Màu đen
    });

    pages[0].node.set(PDFName.of('Annots'), loadedPdf.context.obj([widgetDictRef]));

    loadedPdf.catalog.set(
      PDFName.of('AcroForm'),
      loadedPdf.context.obj({
        SigFlags: 3,
        Fields: [widgetDictRef],
      })
    );

    const pdfBytes = await loadedPdf.save({ useObjectStreams: false , password: password});

    return SignPDF.unit8ToBuffer(pdfBytes);
  }

  /**
   * @param {Uint8Array} unit8
   */
  static unit8ToBuffer(unit8) {
    let buf = Buffer.alloc(unit8.byteLength);
    const view = new Uint8Array(unit8);

    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }
}

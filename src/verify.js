const fs = require('fs');
const forge = require('node-forge');
const PDFLib = require('pdf-lib');

async function verifySignature(pdfPath, signatureField) {
  try {
    // Đọc tệp PDF đã ký
    const pdfBytes = await fs.promises.readFile(pdfPath);
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

    // Lấy chữ ký từ trường chữ ký (signatureField) - Thay 'Signature1' bằng tên trường chữ ký của bạn
    const signature = pdfDoc.getForm().getField(signatureField).getWidgets()[0].getAppearances().getNormalAppearanceStream();

    // Chuyển chữ ký thành chuỗi PEM
    const pemSignature = signature.decodeText();

    // Tạo một đối tượng PKCS#7 từ chuỗi PEM chữ ký
    const p7 = forge.pkcs7.messageFromPem(pemSignature);

    // Xác thực chữ ký với chứng thực (certificate) - Thay 'certificate.pem' bằng tên tệp chứng thực của bạn
    const certificatePem = await fs.promises.readFile('/output_directory/certificate.crt');
    const certificate = forge.pki.certificateFromPem(certificatePem);
    const verified = p7.verify([certificate]);

    if (verified) {
      console.log('Chữ ký hợp lệ và thuộc về bạn.');
    } else {
      console.log('Chữ ký không hợp lệ hoặc không thuộc về bạn.');
    }
  } catch (error) {
    console.error('Lỗi trong quá trình xác thực chữ ký:', error);
  }
}

// Gọi hàm để xác thực chữ ký trong tệp PDF
verifySignature('exported_file_715.pdf', 'haraworks'); // Thay 'signed_doc.pdf' bằng tên tệp PDF đã ký của bạn và 'Signature1' bằng tên trường chữ ký của bạn
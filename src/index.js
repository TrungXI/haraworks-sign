import SignPDF from "./SignPDF";
import fs from "fs";
import path from "path";

async function main() {
  const pdfBuffer = new SignPDF(
    path.resolve('output_directory/sample.pdf'),
    path.resolve('output_directory/certificate.p12'),
    path.resolve('output_directory/signature.png')
  );

  const signedDocs = await pdfBuffer.signPDF('haraworks');
  const randomNumber = Math.floor(Math.random() * 5000);
  const pdfName = `exported_file_${randomNumber}.pdf`;

  await fs.writeFileSync(pdfName, signedDocs);
  console.log(`New Signed PDF created called: ${pdfName}`);

    //Multil Sign File
    // Chữ ký 1
    // const pdfBuffer1 = new SignPDF("sample.pdf", "certificate1.p12");
    // const signedDocs1 = await pdfBuffer1.signPDF();
    // await fs.writeFileSync("signed_doc_1.pdf", signedDocs1);
  
    // // Chữ ký 2
    // const pdfBuffer2 = new SignPDF("signed_doc_1.pdf", "certificate2.p12");
    // const signedDocs2 = await pdfBuffer2.signPDF();
    // await fs.writeFileSync("signed_doc_2.pdf", signedDocs2);


    // Thêm import cho thư viện xử lý dấu thời gian số hóa
// import timestamp from "timestamp-library";

// // Bên trong hàm signPDF trong tệp SignPDF.js
// async signPDF() {
//   let newPDF = await this._addPlaceholder();
//   newPDF = signer.sign(newPDF, this.certificate);

//   // Đính kèm dấu thời gian số hóa vào chữ ký
//   const timestampedPDF = await timestamp(newPDF);

//   return timestampedPDF;
// }

}

main();

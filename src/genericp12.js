const fs = require('fs');
const forge = require('node-forge');

function createPKCS12(privateKeyPath, certificatePath, outputPath, password) {
  // Đọc tệp khóa riêng tư và chứng chỉ
  const privateKeyPem = fs.readFileSync(privateKeyPath, 'utf8');
  const certificatePem = fs.readFileSync(certificatePath, 'utf8');

  // Tạo đối tượng khóa riêng tư và chứng chỉ từ PEM
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const certificate = forge.pki.certificateFromPem(certificatePem);

  // Tạo khóa PKCS#12
  const pkcs12 = forge.pkcs12.toPkcs12Asn1(privateKey, [certificate], password);

  // Chuyển đổi sang DER
  const pkcs12Der = forge.asn1.toDer(pkcs12).getBytes();

  // Ghi tệp PKCS#12
  fs.writeFileSync(outputPath, pkcs12Der, 'binary');
  console.log('PKCS12 file generated successfully:', outputPath);
}

const privateKeyPath = './output_directory/private.key';
const certificatePath = './output_directory/certificate.crt';
const outputPath = './output_directory/certificate.p12';
const password = 'haraworks'; // Đặt mật khẩu tại đây

createPKCS12(privateKeyPath, certificatePath, outputPath, password);

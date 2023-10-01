// const forge = require('node-forge');
// const fs = require('fs');

// // Tạo cặp khóa RSA
// const keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });

// // Lưu private key vào file
// const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
// fs.writeFileSync('private.key', privateKeyPem);

// // Lưu public key vào file
// const publicKeyPem = forge.pki.publicKeyToPem(keys.publicKey);
// fs.writeFileSync('public.key', publicKeyPem);


// // Đọc private key và public key từ file
// // const privateKeyPem = fs.readFileSync('private.key', 'utf8');
// // const publicKeyPem = fs.readFileSync('public.key', 'utf8');

// // Tạo một object PKCS12 và đặt mật khẩu cho nó
// const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
//   forge.pki.privateKeyFromPem(privateKeyPem),
//   [forge.pki.certificateFromPem(publicKeyPem)],
//   '0000'
// );

// // Chuyển đổi PKCS12 ASN.1 thành binary DER
// const p12Der = forge.asn1.toDer(p12Asn1).getBytes();

// // Lưu PKCS12 vào file
// fs.writeFileSync('certificate.p12', p12Der, 'binary');


// const forge = require('node-forge');
// const fs = require('fs');

// // Tạo cặp khóa X.509
// const keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });

// // Tạo chứng chỉ X.509 cho public key
// const cert = forge.pki.createCertificate();
// cert.publicKey = keys.publicKey;
// cert.serialNumber = '01'; // Số xê-ri chứng chỉ (có thể thay đổi)
// cert.validity.notBefore = new Date();
// cert.validity.notAfter = new Date();
// cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1); // Thời hạn chứng chỉ
// const attrs = [
//   { name: 'commonName', value: 'Haraworks' }, // Tên thông dụng
//   { name: 'countryName', value: 'VN' }, // Quốc gia
//   // Thêm các thuộc tính khác tùy theo nhu cầu
// ];
// cert.setSubject(attrs);
// cert.setIssuer(attrs); // Cấp chứng chỉ và người nhận chứng chỉ có thể khác nhau
// cert.sign(keys.privateKey, forge.md.sha256.create());

// // Lưu private key vào file
// const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
// fs.writeFileSync('private.key', privateKeyPem);

// // Lưu public key và chứng chỉ X.509 vào file
// const publicKeyPem = forge.pki.publicKeyToPem(keys.publicKey);
// fs.writeFileSync('public.key', publicKeyPem);
// const certificatePem = forge.pki.certificateToPem(cert);
// fs.writeFileSync('certificate.pem', certificatePem);

// // // Đọc nội dung private key và certificate từ file
// // const privateKeyPem = fs.readFileSync('private.key', 'utf8');
// // const certificatePem = fs.readFileSync('certificate.pem', 'utf8');

// // Tạo một object PKCS12
// const p12 = forge.pkcs12.toPkcs12Asn1(
//   forge.pki.privateKeyFromPem(privateKeyPem),
//   forge.pki.certificateFromPem(certificatePem)
// );

// // Chuyển đổi PKCS12 ASN.1 thành binary DER
// const p12Der = forge.asn1.toDer(p12).getBytes();

// // Lưu PKCS12 vào file
// fs.writeFileSync('certificate.p12', p12Der, 'binary');
const fs = require('fs');
const forge = require('node-forge');

function generateCertificate(config, outputPath) {
  // Tạo cặp khóa RSA
  const keys = forge.pki.rsa.generateKeyPair(2048);
  const privateKey = forge.pki.privateKeyToPem(keys.privateKey);
  const publicKey = forge.pki.publicKeyToPem(keys.publicKey);

  // Tạo chứng chỉ tự ký
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  const attrs = [
    { name: 'commonName', value: config.commonName },
    { name: 'countryName', value: config.countryName },
    { name: 'organizationName', value: config.organizationName },
    { shortName: 'ST', value: config.state },
    { shortName: 'OU', value: config.organizationalUnit },
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  cert.sign(keys.privateKey);

  // Lưu khóa riêng tư vào tệp private.key
  fs.writeFileSync(`${outputPath}/private.key`, privateKey);

  // Lưu khóa công khai và chứng chỉ vào tệp certificate.crt
  const pemCert = forge.pki.certificateToPem(cert);
  fs.writeFileSync(`${outputPath}/certificate.crt`, `${pemCert}${publicKey}`);
}

  // Cấu hình chứng chỉ
const config = {
  commonName: 'Haraworks',
  countryName: 'VN',
  organizationName: 'Haraworks',
  state: 'HCM',
  organizationalUnit: 'HRW',
};

// Gọi hàm để tạo tệp
generateCertificate(config, './output_directory');
const fs = require('fs');
const forge = require('node-forge');
function  generateCertificate (config, outputPath) {
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
    // fs.writeFileSync(`${outputPath}/private.key`, privateKey);

    // Lưu khóa công khai và chứng chỉ vào tệp certificate.crt
    // const pemCert = forge.pki.certificateToPem(cert);
    // fs.writeFileSync(`${outputPath}/certificate.crt`, `${pemCert}${publicKey}`);

    const pemCert = forge.pki.certificateToPem(cert);
    const certificateData = `${pemCert}${publicKey}`;
    const privateKeyData = privateKey;
    return { certificateData,publicKey, privateKeyData };
  }

    // Cấu hình chứng chỉ
const defaultConfig = {
  commonName: 'Haraworks',
  countryName: 'VN',
  organizationName: 'Haraworks',
  state: 'HCM',
  organizationalUnit: 'HRW',
} 

// Gọi hàm để tạo tệp 
// generateCertificate(config, './output_directory');

module.exports =  {generateCertificate, defaultConfig}
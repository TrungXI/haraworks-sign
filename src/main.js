const {generateCertificate , defaultConfig} = require('./generic');
const {createPKCS12} = require('./genericp12');

module.exports = {
  generateCertificate, defaultConfig,createPKCS12
};
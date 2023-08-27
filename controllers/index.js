const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../database/products.json');

const readProductsFile = () => {
  try {
    const productsData = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(productsData);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

const index = {
  get: (req, res) => {
    try {
      const alertMessage = req.session.alertMessage;
      req.session.alertMessage = null;
      const productsData = readProductsFile();
      res.render('home', { productos: productsData, alertMessage });
    } catch (error) {
      console.error(error);
      res.render('error');
    }
  },
};

module.exports = {
  index
};

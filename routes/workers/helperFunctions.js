//const { default: fetch } = require("node-fetch");

const fetch =  require("node-fetch")

async function createReceipt(it, res) {
  try {
    await new Promise((resolve, reject) => {
      pool.createClientReceipts(it.id ,it.iic, it.dateTimeCreated, it.sameTaxes[0].priceBeforeVat, it.totalPrice, 10, 323050, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    // Call your next function here, if applicable
    
  } catch (err) {
    return res.status(401).json({ message: 'Error Database', error: err });
  }
}

async function getCategory(req) {
  console.log(req.get('host'))
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const path = '/category';
    const url = `${baseUrl}${path}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const namesArray = data.map(category => category.name);
        return namesArray;
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
}

module.exports = {createReceipt, getCategory}
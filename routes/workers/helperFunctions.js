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

module.exports = {createReceipt}
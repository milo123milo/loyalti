var connection = require('./db_connection')
connection = connection.pool

function getAllCategory(callback){
  const sql = 'SELECT * FROM category';
  connection.query(sql, (err, rows) => {
    if (err) throw err;
    callback(rows);
  });
}
function getUserById(id, callback) {
  const sql = 'SELECT * FROM users WHERE id = ?';
  connection.query(sql, [id], (err, rows) => {
    if (err) throw err;
    callback(rows[0]);
  });
}
function getUserByName(name, callback) {
  const sql = 'SELECT * FROM users WHERE name = ?';
  connection.query(sql, [name], (err, rows) => {
    if (err) throw err;
    callback(rows[0]);
  });
}
function getAllUsers(callback){
  const sql = 'SELECT * FROM users';
  connection.query(sql, (err, rows) => {
    if (err) throw err;
    callback(rows);
  });

}
function deleteUser(id){
  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [id], (err, rows) => {
    if (err) throw err;
  });
}

function createUser(username, password, role) {
  const sql = 'INSERT INTO users (name, password, role) VALUES (?, ?, ?)';
  connection.query(sql, [username, password, role], (err, rows) => {
    if (err) throw err;
  });
}

function editUser(id, username, password, role) {
  const sql = `UPDATE users
SET name = ?, password = ?, role = ?
WHERE id = ?;`
connection.query(sql, [username, password, role, id], (err, rows) => {
    if (err) throw err;
  });
}

function getAllClients(callback){
  const sql = 'SELECT * FROM clients';
  connection.query(sql, (err, rows) => {
    if (err) throw err;
    callback(rows);
  });
}
function getClientById(id, callback){
  const sql = 'SELECT * FROM clients WHERE id = ?';
  connection.query(sql, [id], (err, rows) => {
    callback(rows, err);
    
  });
}
function deleteClient(id){
  const sql = 'DELETE FROM clients WHERE id = ?';
  connection.query(sql, [id], (err, rows) => {
    if (err) throw err;
  });
}
function createClient(name, discount, type, pib, address, dcat, start, end, info) {
  const sql = 'INSERT INTO clients (name, discount, type, pib, address, dcat, start, end, info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [name, discount, type, pib, address, dcat, start, end, info],  (err, rows) => {
    if (err) throw err;
  });
}
function editClient(id, name, discount, type, pib, address, dcat, end) {
  const sql = `UPDATE clients
SET name = ?, discount = ?, type = ?, pib = ?, address = ?, dcat = ?, end = ?
WHERE id = ?;`
connection.query(sql, [name, discount, type, pib, address, dcat, end, id], (err, rows) => {
    if (err) throw err;
  });
}
function updateClientInfo(id, info) {
  const sql = `
  UPDATE clients
  SET info = ?
  WHERE id = ?`
connection.query(sql, [info, id], (err, rows) => {
    if (err) throw err;
  });
}

function getClientReceipts(id, callback){
  const sql = 'SELECT * FROM receipts WHERE ClientID  = ?';
  connection.query(sql, [id], (err, rows) => {
    if (err) throw err;
    callback(rows) 
  });
}
function createClientReceipts(ID, IIC, Date, Total, TotalVAT, Discount, ClientID, callback) {
  const sql = 'INSERT INTO receipts (ID, IIC, Date, Total, TotalVAT, Discount, ClientID) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [ID, IIC, Date, Total, TotalVAT, Discount, ClientID], (err, rows) => {
    callback(err)
    
  });
}
function getReceiptItems(id, callback){
  const sql = 'SELECT * FROM receiptitems WHERE ReceiptID  = ?';
  connection.query(sql, [id], (err, rows) => {
    if (err) throw err;
    callback(rows) 
  });
}
function createReceiptItem(ReceiptID, Name, Quantity, Unit, PricePerPiece, PriceTotal, PriceTotalVAT, Discount, Total) {
  const sql = 'INSERT INTO receiptitems (ReceiptID, Name, Quantity, Unit, PricePerPiece, PriceTotal, PriceTotalVAT, Discount, Total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [ReceiptID, Name, Quantity, Unit, PricePerPiece, PriceTotal, PriceTotalVAT, Discount, Total], (err, rows) => {
    if (err) throw err;
  });
}

function getClientReceiptTotals(clientID, startDate, endDate, callback) {
  const sql = `SELECT 
                  SUM(Total) AS TotalSum, 
                  SUM(TotalVAT) AS TotalVATSum, 
                  SUM(TotalVat - (TotalVat/100)*Discount) AS TotalDiscountedSum,
                  DATE(Date) AS DatePoint
              FROM receipts
              WHERE 
                  ClientID = ?
                  AND Date >= ?
                  AND Date <= ?
              GROUP BY DatePoint;`;
  const values = [clientID, startDate, endDate];
  connection.query(sql, values, (err, result) => {
    if (err) {
      callback(err);
    } else {
      const totals = result
      callback(null, totals);
    }
  });
}
function getClientReceiptItems(clientID, startDate, endDate, callback) {
  const sql = `SELECT 
                  ri.Name,
                  SUM(ri.Quantity) AS TotalQuantity,
                  SUM(ri.PriceTotal) AS TotalPrice,
                  AVG(ri.PricePerPiece) AS PricePerPiece,
                  SUM(ri.PriceTotalVAT) AS TotalPriceVAT,
                  ri.Discount,
                  SUM(ri.Total) AS TotalDisc
               FROM 
                  receiptitems ri
                  INNER JOIN receipts r ON ri.ReceiptID = r.ID
               WHERE 
                  r.ClientID = ?
                  AND r.Date >= ?
                  AND r.Date <= ?
               GROUP BY 
                  ri.Name`;
  const values = [clientID, startDate, endDate];
  connection.query(sql, values, (err, results) => {
    if (err) {
      callback(err);
    } else {
      const receiptItems = results.map(result => ({
        name: result.Name,
        totalQuantity: result.TotalQuantity,
        totalPrice: result.TotalPrice,
        pricePerPiece: result.PricePerPiece,
        totalPriceVAT: result.TotalPriceVAT,
        discount: result.Discount,
        totalDisc: result.TotalDisc,
      }));
      callback(null, receiptItems);
    }
  });
}

function getAllReceiptTotals(startDate, endDate, callback) {
  const sql = `SELECT 
                  SUM(Total) AS TotalSum, 
                  SUM(TotalVAT) AS TotalVATSum, 
                  SUM(TotalVat - (TotalVat/100)*Discount) AS TotalDiscountedSum,
                  DATE(Date) AS DatePoint
              FROM receipts
              WHERE 
                  Date >= ?
                  AND Date <= ?
              GROUP BY DatePoint;`;
  const values = [startDate, endDate];
  connection.query(sql, values, (err, result) => {
    if (err) {
      callback(err);
    } else {
      const totals = result
      callback(null, totals);
    }
  });
}
function getAllReceiptItems( startDate, endDate, callback) {
  const sql = `SELECT 
                  ri.Name,
                  SUM(ri.Quantity) AS TotalQuantity,
                  SUM(ri.PriceTotal) AS TotalPrice,
                  AVG(ri.PricePerPiece) AS PricePerPiece,
                  SUM(ri.PriceTotalVAT) AS TotalPriceVAT,
                  SUM(ri.Total) AS TotalDisc
               FROM 
                  receiptitems ri
                  INNER JOIN receipts r ON ri.ReceiptID = r.ID
               WHERE 
                  r.Date >= ?
                  AND r.Date <= ?
               GROUP BY 
                  ri.Name`;
  const values = [startDate, endDate];
  connection.query(sql, values, (err, results) => {
    if (err) {
      callback(err);
    } else {
      const receiptItems = results.map(result => ({
        name: result.Name,
        totalQuantity: result.TotalQuantity,
        totalPrice: result.TotalPrice,
        pricePerPiece: result.PricePerPiece,
        totalPriceVAT: result.TotalPriceVAT,
        discount: result.Discount,
        totalDisc: result.TotalDisc,
      }));
      callback(null, receiptItems);
    }
  });
}


module.exports = {
  getUserById,
  getUserByName,
  getAllUsers,
  deleteUser,
  createUser,
  editUser,
  getAllClients,
  getClientById,
  deleteClient,
  createClient,
  editClient,
  updateClientInfo,
  getClientReceipts,
  getReceiptItems,
  createClientReceipts,
  createReceiptItem,
  getClientReceiptTotals,
  getClientReceiptItems,
  getAllReceiptTotals,
  getAllReceiptItems,
  getAllCategory
};
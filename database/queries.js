var connection = require('./db_connection')

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
function deleteClient(id){
  const sql = 'DELETE FROM clients WHERE id = ?';
  connection.query(sql, [id], (err, rows) => {
    if (err) throw err;
  });
}
function createClient(name, discount, type, pib, address) {
  const sql = 'INSERT INTO clients (name, discount, type, pib, address) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [name, discount, type, pib, address], (err, rows) => {
    if (err) throw err;
  });
}
function editClient(id, name, discount, type, pib, address) {
  const sql = `UPDATE clients
SET name = ?, discount = ?, type = ?, pib = ?, address = ?
WHERE id = ?;`
connection.query(sql, [name, discount, type, pib, address, id], (err, rows) => {
    if (err) throw err;
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
  deleteClient,
  createClient,
  editClient
};
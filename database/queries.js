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
module.exports = {
  getUserById,
  getUserByName,
  getAllUsers,
  deleteUser
};
var mysql = require('mysql');


var pool = mysql.createPool({
  connectionLimit:4,
  host: "localhost",
  user: "root",
  password: "",
  database:"test_db"
});

pool.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool
const mysql = require('mysql');
const cfg = require('./module/config');

const conn = mysql.createConnection(cfg.MySQLConnectionInfo);

conn.connect(function(err) {
    if(err) {
        console.log('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + conn.threadId);
});

conn.query('SELECT 1 + 1 AS solution', function (err, results, fields) {
    if (err) throw err;
    console.log(results);
    console.log('The solution is ', results[0].solution);
});

conn.end();
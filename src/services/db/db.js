const sqlite3 = require('sqlite3').verbose();
import { ipcMain } from 'electron';

// Create a new SQLite database connection
let db = new sqlite3.Database('./ahenkdeskdb', (err) => {
  if (err) {
    console.error(err.message);
  }
});

// Listen for the "db:send" event from the renderer process
ipcMain.on("db:send", (e, value) => {
  // Insert the received data into the 'messages' table in the database
  db.run(`INSERT INTO messages (username, unit, subject, error, date) VALUES (?, ?, ?, ?, ?)`,
    [value.username, value.unit, value.subject, value.error, value.date],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
    }
  );
});

// Listen for the "get-data" event from the renderer process
ipcMain.on('get-data', (event, arg) => {
  // Define the SQL query to retrieve all rows from the 'messages' table
  const sql = 'SELECT * FROM messages';
  // Execute the query
  db.all(sql, [], (err, rows) => {
    if (err) {
      // If there's an error, send an error message back to the renderer process
      console.error(err.message);
      event.reply('get-data-reply', { error: err.message });
    } else {
      // If the query is successful, send the data (rows) back to the renderer process
      event.reply('get-data-reply', { data: rows });
    }
  });
});

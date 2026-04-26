import { config } from "./config.mjs";
import mysql from "mysql";

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});


export const handler = async (event) => {
  const storeID = event.storeID;
  const chainID = event.chainID

  return new Promise((resolve, reject) => {
    const addQuery =
      'UPDATE stores SET deleted = 1 WHERE store_id = ?';
    pool.query(addQuery, [storeID], (error) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage));
      } else {
        const selectQuery = `SELECT * FROM stores WHERE chain_id = ?`;

        pool.query(selectQuery, [chainID], (selectError, rows) => {
          if (selectError) {
            reject(new Error("Database error: " + selectError.sqlMessage));
            return;
          }

          resolve(rows);
        });
      }
    });
  });
};

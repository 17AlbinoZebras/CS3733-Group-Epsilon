import { config } from "./config.mjs";
import mysql from "mysql";

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

export const handler = async (event) => {
  const chainID = event.chainID;
  const address = event.address;
  const name = event.name

  return new Promise((resolve, reject) => {
    const addQuery =
      'INSERT INTO stores (store_id, store_address, store_name, chain_id) VALUES (uuid(), ?, ?, ?)';
    pool.query(addQuery, [address, name, chainID], (error) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage));
      } else {
        // TODO: our code shows we return just the store, but I think we should return all stores in the chain because it might be easier...?
        const selectQuery = `SELECT * FROM stores where chain_id = ?`;

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
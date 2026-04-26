import { config } from "./config.mjs";
import mysql from "mysql";

// Connection pool setup with limit 1 for Lambda environment
var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: 1, 
});

export const handler = async (event) => {
  const shopperID = event.shopperID || event.queryStringParameters?.shopperID;
  let searchQuery = event.query || event.queryStringParameters?.query;

  // Validation
  if (!searchQuery) {
    // get all items
    searchQuery = ""
  }

  if (!shopperID) {
    return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Shopper ID is required" }) 
    };
  }

  return new Promise((resolve, reject) => {
    // JOIN 4 tables to get the full context: Item -> Receipt -> Store -> Chain
    const sql = `
      SELECT 
        ri.item_id,
        ri.item_name,
        ri.item_category,
        ri.item_quantity,
        ri.unit_price,
        r.receipt_datetime,
        s.store_address,
        c.chain_name
      FROM receipt_items ri
      JOIN receipts r ON ri.receipt_id = r.receipt_id
      JOIN stores s ON r.store_id = s.store_id
      JOIN chains c ON s.chain_id = c.chain_id
      WHERE r.shopper_id = ?
      AND (? = '' OR LOWER(ri.item_name) LIKE LOWER(?))
      ORDER BY r.receipt_datetime DESC
      LIMIT 50;
    `;

    const formattedQuery = `%${searchQuery}%`; // Add wildcards for partial match

    pool.query(sql, [shopperID, searchQuery, formattedQuery], (error, rows) => {
      if (error) {
        console.error("SQL Error", error);
        resolve({ 
            statusCode: 500, 
            body: JSON.stringify({ error: "Database error: " + error.sqlMessage }) 
        });
      } else {
        resolve({ 
            statusCode: 200, 
            body: JSON.stringify(rows) 
        });
      }
    });
  });
};
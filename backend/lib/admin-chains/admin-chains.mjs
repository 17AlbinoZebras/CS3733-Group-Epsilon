import { config } from './config.mjs'
import mysql from 'mysql'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})

export const handler = async (event) => {
  return new Promise((resolve, reject) => {
    const selectQuery = `
      SELECT 
          c.*, 
          COALESCE(SUM(ri.unit_price * ri.item_quantity), 0) AS chain_sales
      FROM 
          chains c
      LEFT JOIN 
          stores s ON c.chain_id = s.chain_id
      LEFT JOIN 
          receipts r ON s.store_id = r.store_id
      LEFT JOIN 
          receipt_items ri ON r.receipt_id = ri.receipt_id
      GROUP BY 
          c.chain_id;
    `
    pool.query(selectQuery, (error, insertResult) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage))
      } else {
        resolve(insertResult)
      }
    })
  })
}
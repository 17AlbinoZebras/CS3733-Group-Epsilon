import { config } from "./config.mjs"
import mysql from "mysql"

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

let getLists = (shopperID) => {
  return new Promise((resolve, reject) => {
    const getQuery = 'SELECT * FROM shopping_lists WHERE shopper_id = ?'
    pool.query(getQuery, [shopperID], (error, rows) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage));
      } else {
        resolve(rows)
      }
    })
  })
}

export const handler = async (event) => {
  let shopperID = event.shopperID
  let result
  let status
  try {
    let lists = await getLists(shopperID)
    result = lists
    status = 200
  }
  catch (error) {
    result = []
    status = 400
  }

  const response = {
    statusCode: status,
    body: JSON.stringify(result)
  }

  return response
}
import { config } from "./config.mjs"
import mysql from "mysql"

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

let deleteList = (listID) => {
  return new Promise((resolve, reject) => {
    const deleteQuery = 'DELETE FROM shopping_lists WHERE shopping_list_id = ?'
    pool.query(deleteQuery, [listID], (error, rows) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage));
      } else {
        resolve(true)
      }
    })
  })
} 

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
  const listID = event.listID
  const shopperID = event.shopperID

  let result
  let status
  try {
    let deleted = await deleteList(listID)
    let entries = await getLists(shopperID)
    result = entries
    status = 200
  }
  catch (error) {
    result = "SQL Error:" + error.errorMessage
    status = 400
  }

  const response = {
    statusCode: status,
    body: JSON.stringify(result)
  }

  return response
}
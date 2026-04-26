import { config } from "./config.mjs"
import mysql from "mysql"
import { v4 as uuidv4 } from "uuid"

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

let insertList = (listID, listName, shopperID) => {
  return new Promise((resolve, reject) => {
    const addQuery = 'INSERT INTO shopping_lists (shopping_list_id, list_name, shopper_id) VALUES (?, ?, ?)'
    pool.query(addQuery, [listID, listName, shopperID], (error, rows) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage));
      } else {
        resolve(true)
      }
    })
  })
} 

let getList = (listID) => {
  return new Promise((resolve, reject) => {
    const getQuery = 'SELECT * FROM shopping_lists WHERE shopping_list_id = ?'
    pool.query(getQuery, [listID], (error, rows) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage));
      } else {
        resolve(rows)
      }
    })
  })
} 


export const handler = async (event) => {
  const listID = uuidv4()
  const listName = event.listName
  const shopperID = event.shopperID

  let result
  let status
  try {
    let inserted = await insertList(listID, listName, shopperID)
    let lists = await getList(listID)
    result = lists
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
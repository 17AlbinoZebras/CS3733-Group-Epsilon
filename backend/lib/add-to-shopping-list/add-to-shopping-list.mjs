import { config } from "./config.mjs"
import mysql from "mysql"
import { v4 as uuidv4 } from "uuid"

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

let insertEntry = (entryID, entryName, entryQuantity, listID) => {
  return new Promise((resolve, reject) => {
    const addQuery = 'INSERT INTO shopping_list_entries (list_entry_id, list_entry_name, list_entry_quantity, shopping_list_id, datetime_edited) VALUES (?, ?, ?, ?, NOW())'
    pool.query(addQuery, [entryID, entryName, entryQuantity, listID], (error, rows) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage));
      } else {
        resolve(true)
      }
    })
  })
} 

let getListEntries = (listID) => {
  return new Promise((resolve, reject) => {
    const getQuery = 'SELECT * FROM shopping_list_entries WHERE shopping_list_id = ?'
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
  const entryID = uuidv4()
  const entryName = event.entryName
  const entryQuantity = event.entryQuantity
  const listID = event.listID

  let result
  let status
  try {
    let inserted = await insertEntry(entryID, entryName, entryQuantity, listID)
    let entries = await getListEntries(listID)
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
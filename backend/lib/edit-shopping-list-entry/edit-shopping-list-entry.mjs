import { config } from "./config.mjs"
import mysql from "mysql"
import { v4 as uuidv4 } from "uuid"

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

let editEntry = (entryID, entryName, entryQuantity) => {
  return new Promise((resolve, reject) => {
    const editQuery = `
    UPDATE shopping_list_entries
    SET list_entry_name = ?, list_entry_quantity = ?
    WHERE list_entry_id = ?`

    pool.query(editQuery, [entryName, entryQuantity, entryID], (error, rows) => {
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
  const entryID = event.entryID
  const entryName = event.entryName
  const entryQuantity = event.entryQuantity
  const listID = event.listID

  let result
  let status
  try {
    let edited = await editEntry(entryID, entryName, entryQuantity)
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
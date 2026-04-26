import { config } from "./config.mjs"
import mysql from "mysql"

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

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
  let listID = event.listID
  let result
  let status
  try {
    let lists = await getListEntries(listID)
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
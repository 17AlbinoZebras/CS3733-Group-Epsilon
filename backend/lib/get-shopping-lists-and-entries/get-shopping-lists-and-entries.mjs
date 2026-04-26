import { config } from "./config.mjs"
import mysql from "mysql"

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

let getListsAndEntries = (shopperID) => {
  return new Promise((resolve, reject) => {
    const getQuery = `
      SELECT
        lists.shopper_id,
        lists.shopping_list_id,
        lists.list_name,
        entries.list_entry_id,
        entries.list_entry_name,
        entries.list_entry_quantity,
        entries.datetime_edited
      FROM shopping_lists lists
      JOIN shopping_list_entries entries ON lists.shopping_list_id = entries.shopping_list_id
      WHERE shopper_id = ?`
    
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
    let lists = await getListsAndEntries(shopperID)
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
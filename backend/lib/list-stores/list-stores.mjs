import { config } from './config.mjs'
import mysql from 'mysql'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})


export const handler = async (event) => {
  const chain_id = event.chainID
  return new Promise((resolve, reject) => {
    
    const selectQuery = "SELECT store_id, store_address, store_name, chain_id, deleted FROM stores WHERE chain_id = ? AND deleted = 0"
    pool.query(selectQuery, [chain_id], (error, insertResult) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage))
      } else {
        resolve(insertResult)
      }
    })
  })
}
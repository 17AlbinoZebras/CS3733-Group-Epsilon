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
    
    const selectQuery = "SELECT * FROM stores WHERE deleted = 0"
    pool.query(selectQuery, (error, insertResult) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage))
      } else {
        resolve(insertResult)
      }
    })
  })
}
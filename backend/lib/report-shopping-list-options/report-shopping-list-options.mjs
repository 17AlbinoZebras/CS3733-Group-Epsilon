import { config } from "./config.mjs"
import mysql from "mysql"

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

const searchQuery = `
      WITH
      stores_existing as (
        SELECT
          stores.store_id,
          stores.store_address,
          stores.store_name,
              stores.deleted AS store_deleted,
              chains.deleted AS chain_deleted
        FROM stores
          JOIN chains ON stores.chain_id = chains.chain_id
          WHERE stores.deleted = 0
          AND chains.deleted = 0
      ),
      store_items AS (
        SELECT
          items.item_id,
          items.item_name,
          items.item_category,
          items.unit_price,
          receipts.store_id,
          receipts.receipt_datetime,
          stores_existing.store_address,
          stores_existing.store_name,
              -- Most recent item in each category in each store
          ROW_NUMBER() OVER (
            PARTITION BY receipts.store_id, items.item_category
            ORDER BY receipts.receipt_datetime DESC
          ) AS rank_recency
        FROM receipt_items items
        JOIN receipts ON items.receipt_id = receipts.receipt_id
        JOIN stores_existing ON receipts.store_id = stores_existing.store_id
          -- All of the categories based on the shopping list entries
        WHERE LOWER(item_category) IN (
          SELECT LOWER(list_entry_name)
              FROM shopping_list_entries
              WHERE shopping_list_id = ?
        )
      ),
      cheapest_items AS (
        SELECT
          *,
              -- Best price of the current store prices for items in each category
          ROW_NUMBER() OVER (
            PARTITION BY item_category
            ORDER BY unit_price ASC
          ) AS rank_cheapest
          FROM store_items
          WHERE rank_recency = 1
      )
      SELECT
        item_id,
        item_name,
        item_category,
        unit_price,
        store_id,
        store_address,
        store_name
      FROM cheapest_items WHERE rank_cheapest <= ?`

let getBestPrices = (listID, numResults) => {
  return new Promise((resolve, reject) => {
    // join receipt_items of corresponding name with their receipt tables
    // group receipt_items by store
    // find the most recent receipt item in each store by sorting by date

      pool.query(searchQuery, [ listID, numResults ], (error, rows) => {
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
  let numResults = event.numResults
  
  let result
  let status
  try {
    let bestDeals = await getBestPrices(listID, numResults)
    result = bestDeals
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

// to find best price:
// Part 1: storing data
    // Each time a new receipt is submitted, add the items to the receipt_items database
// Part 2: calculations
    // based on the shopping list entry's name (and eventually category), find all corresponding receipt_items.
        // join receipt_items of corresponding name with their receipt tables
        // group receipt_items by store
        // find the most recent receipt item in each store by sorting by date
    // then find the one with the best price
    // could eventually allow users to choose to filter by best price or by closest distance
        // and if prices are the same, show the closer option
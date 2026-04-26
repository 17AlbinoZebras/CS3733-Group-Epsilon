import { config } from "./config.mjs";
import mysql from "mysql";

var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: 1,
});

export const handler = async (event) => {
    const shopperID = event.shopperID;

    return new Promise((resolve, reject) => {
        // 1. The SQL Query (Updated to match your schema)
        const sql = `
      SELECT 
        r.receipt_id, 
        r.receipt_datetime as receipt_datetime, 
        s.store_id,
        s.store_address, 
        c.chain_name,
        ri.item_name as item_name,
        ri.item_category as item_category,
        ri.item_quantity, 
        ri.unit_price as price
      FROM receipts r
      JOIN stores s ON r.store_id = s.store_id
      JOIN chains c ON s.chain_id = c.chain_id
      LEFT JOIN receipt_items ri ON r.receipt_id = ri.receipt_id
      WHERE r.shopper_id = ?
      ORDER BY r.receipt_datetime DESC;
    `;

        pool.query(sql, [shopperID], (error, rows) => {
            if (error) {
                reject(new Error("Database error: " + error.sqlMessage));
            } else {
                // 2. Process the flat rows into nested objects
                const receiptsMap = new Map();

                rows.forEach((row) => {
                    if (!receiptsMap.has(row.receipt_id)) {
                        // Create the receipt entry if we haven't seen it yet
                        receiptsMap.set(row.receipt_id, {
                            receipt_id: row.receipt_id,
                            receipt_datetime: row.receipt_datetime,
                            store_id: row.store_id,
                            store_address: row.store_address,
                            chain_name: row.chain_name,
                            totalPrice: 0,
                            items: [],
                        });
                    }

                    const receipt = receiptsMap.get(row.receipt_id);

                    // If this row has an item (check item_name is not null)
                    if (row.item_name) {
                        // Use 'item_quantity' from your new SQL alias
                        const quantity = row.item_quantity;
                        const price = row.price;
                        const itemTotal = quantity * price;
                        const itemCategory = row.item_category;

                        // Add to total price
                        receipt.totalPrice += itemTotal;

                        // Add item to list
                        receipt.items.push({
                            name: row.item_name,
                            category: itemCategory,
                            quantity: quantity,
                            price: price,
                        });
                    }
                });

                // 3. Convert Map values back to an Array
                const finalResponse = Array.from(receiptsMap.values());

                resolve(finalResponse);
            }
        });
    });
};
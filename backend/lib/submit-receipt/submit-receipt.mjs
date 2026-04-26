import { config } from "./config.mjs"
import mysql from "mysql"
import { v4 as uuidv4 } from "uuid"

var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
});

let insertReceipt = async (receipt_id, store_id, shopper_id, receipt_datetime) => {
    return new Promise((resolve, reject) => {
        let addQuery
        let params
        if (!receipt_datetime) {
            addQuery = 'INSERT INTO receipts (receipt_id, receipt_datetime, store_id, shopper_id) VALUES (?, NOW(), ?, ?)'
            params = [receipt_id, store_id, shopper_id]
        }
        else {
            addQuery = 'INSERT INTO receipts (receipt_id, receipt_datetime, store_id, shopper_id) VALUES (?, ?, ?, ?)'
            params = [receipt_id, receipt_datetime, store_id, shopper_id]
        }
        pool.query(addQuery, params, (error) => {
            if (error) {
                reject(new Error("Database error: " + error.sqlMessage));
            } else {
                resolve(true)
            }
        })
    })
}

let insertItem = async (item_id, item_name, unit_price, item_category, item_quantity, receipt_id) => {
    return new Promise((resolve, reject) => {
        const addQuery = 'INSERT INTO receipt_items (item_id, item_name, unit_price, item_category, item_quantity, receipt_id) VALUES (?, ?, ?, ?, ?, ?)';
        pool.query(addQuery, [item_id, item_name, unit_price, item_category, item_quantity, receipt_id], (error) => {
            if (error) {
                reject(new Error("Database error: insertItem: " + error.sqlMessage));
            } else {
                resolve(true);
            };
        })
    });
};

let getReceipts = async (shopperID) => {
    return new Promise((resolve, reject) => {
        const getQuery = 'SELECT * FROM receipts where shopper_id = ?'
        pool.query(getQuery, [shopperID], (error, rows) => {
            if (error) {
                reject(new Error("Database error: getReceipts: " + error.sqlMessage));
            } else {
                resolve(rows)
            }
        })
    })
}

const updateSales = async (store_id, items) => {
    const totalSales = items.reduce((total, item) => total + item.unit_price * item.item_quantity, 0)
    return new Promise ((resolve, reject) => {
        const updateSalesQuery = "UPDATE stores SET sales = sales + ? where store_id = ?"
        pool.query(updateSalesQuery, [totalSales, store_id], (error, rows) => {
            if (error) {
                reject(new Error("Database error: updateSales: " + error.sqlMessage))
            } else {
                resolve(rows)
            }
        })
    })
}


export const handler = async (event) => {
    const items = typeof event.items === 'string' ? JSON.parse(event.items) : event.items;

    const itemsArray = items.map(item => ({
        item_name: item.name,
        item_category: item.category.toLowerCase(),
        item_quantity: item.quantity,
        unit_price: item.priceTotal,
    }));

    const receipt_id = uuidv4()
    const store_id = event.store_id
    const shopper_id = event.shopper_id
    const receipt_datetime = event.receipt_datetime

    let result
    let status

    try {
        await insertReceipt(receipt_id, store_id, shopper_id, receipt_datetime)
        for (const item of itemsArray) {
            await insertItem(uuidv4(), item.item_name, item.unit_price, item.item_category, item.item_quantity, receipt_id)
        };
        await updateSales(store_id, itemsArray)
        result = await getReceipts(shopper_id)
        status = 200
    }
    catch (error) {
        result = "SQL Error:" + error
        status = 400
    }

    const response = {
        statusCode: status,
        body: JSON.stringify(result)
    }

    return response
}
import { config } from "./config.mjs"
import mysql from "mysql"

var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
});

let getActivity = async (dateFormat, groupBy, shopperID) => {
    return new Promise((resolve, reject) => {
        const getQuery = `
            SELECT 
                DATE_FORMAT(r.receipt_datetime, ?) AS period,
                MIN(r.receipt_datetime) AS sort_date,
                SUM(ri.item_quantity * ri.unit_price) AS total
            FROM receipt_items ri
            JOIN receipts r ON r.receipt_id = ri.receipt_id
            WHERE r.shopper_id = ?
            GROUP BY ${groupBy}
            ORDER BY sort_date ASC
        `
        pool.query(getQuery, [dateFormat, shopperID], (error, rows) => {
            if (error) {
                reject(new Error("Database error: getActivity: " + error.sqlMessage));
            } else {
                const result = rows.map(r => ({
                    period: r.period,
                    sort_date: r.sort_date,
                    total_spent: Number(r.total)
                }))
                resolve(result)
            }
        })
    })
}

export const handler = async (event) => {
    let result
    let status
    const period = event.period

    let groupBy
    let dateFormat

    if (period === "day") {
        groupBy = "DATE(r.receipt_datetime)"
        dateFormat = "%Y-%m-%d"
    } else if (period === "week") {
        // Use the first day of the week for consistent formatting
        groupBy = "YEARWEEK(r.receipt_datetime, 1)"
        dateFormat = "%Y-W%v"
    } else if (period === "month") {
        groupBy = "YEAR(r.receipt_datetime), MONTH(r.receipt_datetime)"
        dateFormat = "%Y-%m"
    } else {
        groupBy = "DATE(r.receipt_datetime)"
        dateFormat = "%Y-%m-%d"
    }

    try {
        result = await getActivity(dateFormat, groupBy, event.shopperID)
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
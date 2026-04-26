import { config } from "./config.mjs";
import mysql from "mysql";

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

export const handler = async (event) => {
  let user = event.request.userAttributes;
  let sub = user.sub;
  let username = event.userName
  let email = user.email

  if (!sub) {
    // no sub, so just run like normal (don't crash the app)
    return event;
  }

  await new Promise((resolve, reject) => {
    const selectQuery =
      "INSERT INTO shoppers (shopper_id, username, email, datetime_created) VALUES (?, ?, ?, NOW())";
    pool.query(selectQuery, [sub, username, email], (error, insertResult) => {
      if (error) {
        reject(new Error("Database error: " + error.sqlMessage));
      } else {
        resolve(insertResult);
      }
    });
  });

  return event;
};

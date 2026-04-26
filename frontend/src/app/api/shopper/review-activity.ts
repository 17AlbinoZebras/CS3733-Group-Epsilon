import { instance, mock } from "../axios";

// mock.onGet("review-activity", { params: { period: "weekly" } }).reply(200, {
//     statusCode: 200,
//     body: JSON.stringify({
//         period: "weekly",
//         totalSpent: 120.45,
//         topStore: "Trader Joe's",
//         topCategory: "Pantry"
//     })
// });

export async function reviewActivity(period: string, shopperID: string) {
    const response = await instance.get("review-activity", { params: { period: period, shopperID: shopperID } });
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
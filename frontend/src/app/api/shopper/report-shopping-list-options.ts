import { ShoppingListDeal } from "../../../../models/interfaces";
import { instance, mock } from "../axios";

// mock.onGet("/shopping-list-options", { params: { listID: /.*/ } }).reply(200, {
//     statusCode: 200,
//     body: JSON.stringify({
//         listID: "abc-123",
//         options: [
//             {
//                 itemID: "12345",
//                 itemName: "Box of Blueberries",
//                 bestPrice: 15,
//                 chain: "Walmart",
//                 storeAddress: "100 institute Ave NE"
//             },
//             {
//                 itemID: "1234567",
//                 itemName: "Milk",
//                 bestPrice: 4,
//                 chain: "Amazon",
//                 storeAddress: "99 institute Ave NE"
//             }
//         ]
//     })
// });

export async function reportShoppingListOptions(listID : string, numResults: number) : Promise<ShoppingListDeal[]> {
    const response = await instance.get("report-shopping-list-options", { params: { listID: listID, numResults: numResults } });
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
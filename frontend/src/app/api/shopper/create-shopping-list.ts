import { ShoppingListInterface } from "../../../../models/interfaces";
import { instance, mock } from "../axios";

// mock.onPost("/create-shopping-list").reply(200, {
//     statusCode: 200,
//     body: JSON.stringify({
//         listID: "34ffe3d",
//         listName: "Grocery List",
//         listItems: []
//     })
// });

interface payloadInterface {
    listName: string
    shopperID: string
}

export async function createShoppingList(payload: payloadInterface) : Promise<ShoppingListInterface[]> {
    // const payload = { listName:listName, shopperID:shopperID }
    const response = await instance.post("create-shopping-list", payload);
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
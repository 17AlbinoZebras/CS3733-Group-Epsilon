import { instance, mock } from "../axios";

// mock.onPost("/remove-from-shopping-list").reply(200, {
//     statusCode: 200,
//     body: JSON.stringify({
//         listID: "34ffe3d",
//         listItems: []
//     })
// });

// const payload = {
//     listID: "34ffe3d",
//     itemID: "123321"
// }

interface payloadInterface {
    entryID: string;
    listID: string;
}

export async function removeFromShoppingList(payload: payloadInterface) {
    const response = await instance.post("remove-from-shopping-list", payload);
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
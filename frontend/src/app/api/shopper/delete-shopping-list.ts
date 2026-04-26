import { instance, mock } from "../axios";

interface payloadInterface {
    listID: string;
    shopperID: string;
}

export async function deleteShoppingList(payload: payloadInterface) {
    const response = await instance.post("delete-shopping-list", payload);
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
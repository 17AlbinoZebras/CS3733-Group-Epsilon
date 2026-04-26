import { ShoppingListEntries } from "../../../../models/interfaces";
import { instance, } from "../axios";

interface payloadInterface {
    entryName: string,
    entryQuantity: string,
    listID: string
}

export async function addToShoppingList(payload: payloadInterface) : Promise<ShoppingListEntries[]> {
    const response = await instance.post("add-to-shopping-list", payload);
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
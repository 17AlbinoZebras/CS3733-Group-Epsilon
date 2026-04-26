import { ShoppingListEntries } from "../../../../models/interfaces";
import { instance, } from "../axios";

interface payloadInterface {
    entryID: string
    entryName: string,
    entryQuantity: string,
    listID: string
}

export async function editShoppingListEntry(payload: payloadInterface) : Promise<ShoppingListEntries[]> {
    const response = await instance.post("edit-shopping-list-entry", payload);
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
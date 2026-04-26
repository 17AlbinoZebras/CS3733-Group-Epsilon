import { ShoppingListEntries } from "../../../../models/interfaces";
import { instance, } from "../axios";

export async function getShoppingListEntries(listID : string) : Promise<ShoppingListEntries[]> {
    const response = await instance.get("get-shopping-list-entries", { params: { listID } });
    let status = response.data.statusCode;
    if (status != 200) return [];
    let vals = JSON.parse(response.data.body);
    return vals;
}
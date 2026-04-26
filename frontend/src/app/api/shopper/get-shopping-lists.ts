import { instance, } from "../axios";

export async function getShoppingLists(shopperID : string) {
    const response = await instance.get("get-shopping-lists", { params: { shopperID : shopperID } });
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
import { StoreAdmin } from "../../../../models/interfaces";
import { instance } from "../axios";

// mock.onGet("/list-chains").reply(200, {
//     statusCode: 200,
//     body: JSON.stringify({
//         chains: [
//             {
//                 chainID: "xyz-789",
//                 chainName: "Trader Joe's",
//                 url: "traderjoes.com",
//             },
//         ]
//     })
// });

export async function adminStores() : Promise<StoreAdmin[]> {
    const response = await instance.get("admin-stores");
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
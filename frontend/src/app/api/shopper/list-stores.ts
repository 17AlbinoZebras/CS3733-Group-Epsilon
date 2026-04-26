import { instance, mock } from "../axios";

// mock.onGet("/list-stores", { params: { chainID: /.*/ } }).reply(200, {
//     statusCode: 200,
//     body: JSON.stringify({

//         chainID: "xyz-789",
//         chainName: "Trader Joe's",
//         url: "traderjoes.com",
//         stores: [
//             { storeID: "c147", address: "659 Worcester Road..." },
//         ]
//     })
// });

export async function listStores(chainID : string) {
    const response = await instance.get("list-stores", { params: { chainID: chainID } });
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
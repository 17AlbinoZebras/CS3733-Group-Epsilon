import { instance } from "../axios";

// mock.onGet("/remove-store").reply(200, {
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


export async function removeStore(storeID: string, chainID: string) {
    const response = await instance.post("remove-store", {storeID, chainID});
	let status = response.data.statusCode;
	if (status != 200) return response.data;
	let vals = JSON.parse(response.data.body);
	return vals;
}
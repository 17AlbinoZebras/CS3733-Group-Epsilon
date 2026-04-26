import { instance } from "../axios";

// mock.onGet("/remove-chain").reply(200, {
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


export async function removeChain(chainID: string) {
    const response = await instance.post("remove-chain", {chainID: chainID});
	let status = response.data.statusCode;
	if (status != 200) return response.data;
	let vals = JSON.parse(response.data.body);
	return vals;
}
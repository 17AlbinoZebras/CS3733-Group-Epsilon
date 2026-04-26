import { instance, mock } from "../axios";

// mock.onPost("/create-chain").reply(200, {
//     statusCode: 200,
//     body: JSON.stringify({
//         chainID: "new-123",
//         chainName: "New Chain",
//         chainUrl: "https://www.google.com/search?q=newchain.com"
//     })
// });

// const payload = {
//     chainName: "New Chain",
//     chainUrl: "httpsang://www.google.com/search?q=newchain.com"
// }

interface payloadInterface {
    chainName: string
    chainUrl: string
}

export async function createChain(payload : payloadInterface) {
    const response = await instance.post("add-chain", payload);
    console.log(response)
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
import { instance, mock } from "../axios";

mock.onGet("/chain-list-stores", { params: { chainID: /.*/ } }).reply(200, {
    statusCode: 200,
    body: JSON.stringify({
        chainID: "xyz-789",
        chainName: "Trader Joe's",
        url: "traderjoes.com",
        stores: [
            {
                storeID: "c147",
                storeAddress: "659 Worcester Road..."
            }]
    })
});

export async function chainListStores() {
    const response = await instance.get("chain-list-stores", { params: { chainID: 'xyz-789' } });
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}
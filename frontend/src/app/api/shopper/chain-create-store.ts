import { instance, mock } from "../axios";

mock.onPost("/chain-create-store").reply(200, {
    statusCode: 200,
    body: JSON.stringify({
    chainID: "new-123",
    storeID: "store-456",
    storeAddress: "123 Main St"})
});

const payload = {
    chainID: "new-123",
    storeAddress: "123 Main St"
}

export async function createChainStore() {
    const response = await instance.post("chain-create-store", payload);
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}